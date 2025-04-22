import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GarmentPreviewComponent } from './components/garment-preview/garment-preview.component';
import { UploadModelComponent } from './components/upload-model/upload-model.component';
import { ResultComponent } from './components/result/result.component';
import { TryOnService } from './services/try-on.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GarmentPreviewComponent, UploadModelComponent, ResultComponent],
  template: `
    <div class="container">
      <div class="content">
        <div class="section">
          <app-garment-preview
            [garmentUrl]="selectedGarment"
          ></app-garment-preview>
        </div>
        <div class="section">
          <app-upload-model
            (modelUploaded)="onModelUploaded($event)"
          ></app-upload-model>
        </div>
        <div class="section">
          <app-result
            [isLoading]="isLoading"
            [isProcessing]="isProcessing"
            [resultImage]="resultImage"
            [error]="error"
          ></app-result>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --surface-ground: #0f1729;
      --surface-card: #1a2337;
      --surface-border: #2a3447;
      --surface-hover: #1e293b;
      --text-color: #f8fafc;
      --text-color-secondary: #94a3b8;
      --primary-color: #3b82f6;
      --primary-color-text: #ffffff;
      --red-500: #ef4444;
      --spacing-2: 0.5rem;
      --spacing-3: 0.75rem;
      --spacing-4: 1rem;
      --spacing-6: 1.5rem;
      --border-radius: 0.5rem;
    }

    .container {
      padding: var(--spacing-4);
      min-height: 100vh;
      background: var(--surface-ground);
    }

    .content {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--spacing-4);
      max-width: 1600px;
      margin: 0 auto;
    }

    .section {
      min-height: 600px;
      max-height: 800px;
    }

    /* Mobile styles */
    @media (max-width: 1024px) {
      .content {
        grid-template-columns: 1fr;
      }

      .section {
        min-height: 400px;
      }
    }

    /* Tablet styles */
    @media (min-width: 1025px) and (max-width: 1280px) {
      .content {
        grid-template-columns: repeat(2, 1fr);
      }

      .section:last-child {
        grid-column: 1 / -1;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  selectedGarment: string | null = null;
  modelImage: string | null = null;
  resultImage: string | null = null;
  isLoading = false;
  isProcessing = false;
  error: string | null = null;
  private statusSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tryOnService: TryOnService
  ) {}

  ngOnInit() {
    // Получаем URL изображения из query параметров
    this.route.queryParams.subscribe(params => {
      if (params['garment_image']) {
        try {
          const decodedUrl = decodeURIComponent(params['garment_image']);
          this.selectedGarment = decodedUrl;
        } catch (e) {
          console.error('Failed to decode garment URL:', e);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  onModelUploaded(imageUrl: string) {
    this.modelImage = imageUrl;
    this.startGeneration();
  }

  private startGeneration() {
    // Проверяем наличие обоих изображений
    if (!this.modelImage || !this.selectedGarment) {
      return;
    }

    // Сбрасываем предыдущий результат
    this.resultImage = null;
    this.error = null;
    
    this.generateResult();
  }

  private generateResult() {
    if (!this.modelImage || !this.selectedGarment) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Отправляем запрос на генерацию
    this.tryOnService.startTryOn({
      model_image: this.modelImage,
      garment_image: this.selectedGarment,
      category: 'tops' // Изменили на tops вместо upper_body
    }).subscribe({
      next: (response) => {
        if (response.error) {
          this.handleError(response.error);
          return;
        }

        // Начинаем отслеживать статус генерации
        this.isLoading = false;
        this.isProcessing = true;
        
        this.statusSubscription?.unsubscribe();
        this.statusSubscription = this.tryOnService.pollStatus(response.id).subscribe({
          next: (status) => {
            if (status.error) {
              this.handleError(status.error);
              return;
            }

            if (status.status === 'completed' && status.output && status.output.length > 0) {
              this.isProcessing = false;
              this.resultImage = status.output[0];
            } else if (status.status === 'failed') {
              this.handleError('Generation failed');
            }
          },
          error: (error) => this.handleError(error.message || 'Failed to check generation status')
        });
      },
      error: (error) => this.handleError(error.message || 'Failed to start generation')
    });
  }

  private handleError(message: string) {
    this.isLoading = false;
    this.isProcessing = false;
    this.error = message;
    console.error('Generation error:', message);
  }
}