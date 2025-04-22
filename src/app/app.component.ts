import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GarmentPreviewComponent } from './components/garment-preview/garment-preview.component';
import { UploadModelComponent } from './components/upload-model/upload-model.component';
import { ResultComponent } from './components/result/result.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TryOnService } from './services/try-on.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GarmentPreviewComponent,
    UploadModelComponent,
    ResultComponent
  ],
  template: `
    <div class="app-container">
      <div class="sections-grid">
        <div class="section">
          <app-garment-preview
            [selectedGarment]="selectedGarment"
            (garmentSelected)="onGarmentSelected($event)">
          </app-garment-preview>
        </div>

        <div class="section upload-section">
          <app-upload-model
            (modelUploaded)="onModelUploaded($event)"
            (processStarted)="startGeneration()"
            [isProcessing]="isProcessing">
          </app-upload-model>
        </div>

        <div class="section result-section">
          <h2 class="section-title">
            <span class="icon">✨</span>
            Result
          </h2>
          <app-result
            [isProcessing]="isProcessing"
            [resultImage]="resultImage">
          </app-result>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      padding: var(--spacing-4);
      background-color: var(--color-background);
      box-sizing: border-box;
    }

    .sections-grid {
      display: grid;
      gap: var(--spacing-4);
      max-width: 1400px;
      margin: 0 auto;
      height: min-content;
    }

    @media (min-width: 1024px) {
      .sections-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .section {
      background-color: var(--color-card-bg);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      min-height: 600px;
    }

    .section-title {
      color: var(--color-text-primary);
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin: 0;
    }

    .section-title .icon {
      font-size: 1.25rem;
    }

    .upload-section, .result-section {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 1023px) {
      .app-container {
        padding: var(--spacing-2);
      }

      .section {
        min-height: 400px;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  selectedGarment: string = '';
  modelImage: string | null = null;
  resultImage: string | null = null;
  isProcessing: boolean = false;
  private statusSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tryOnService: TryOnService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['garment_image']) {
        try {
          // Декодируем URL, если он закодирован
          const decodedUrl = decodeURIComponent(params['garment_image']);
          this.selectedGarment = decodedUrl;
          
          // Обновляем URL с декодированным параметром для лучшей читаемости
          this.updateUrlParams(decodedUrl);
        } catch (e) {
          console.error('Error decoding garment URL:', e);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }
  
  onGarmentSelected(garmentUrl: string): void {
    this.selectedGarment = garmentUrl;
    this.updateUrlParams(garmentUrl);
    if (this.modelImage) {
      this.generateResult();
    }
  }
  
  onModelUploaded(imageUrl: string): void {
    this.modelImage = imageUrl;
  }
  
  onProcessStarted(): void {
    if (this.modelImage && this.selectedGarment) {
      this.generateResult();
    }
  }

  private updateUrlParams(garmentUrl: string): void {
    // Обновляем URL без перезагрузки страницы
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: { garment_image: garmentUrl },
        queryParamsHandling: 'merge', // сохраняем другие параметры URL
        replaceUrl: true // заменяем текущую запись в истории браузера
      }
    );
  }
  
  generateResult(): void {
    if (!this.modelImage || !this.selectedGarment) {
      return;
    }

    this.isProcessing = true;
    this.resultImage = null;

    this.tryOnService.startTryOn({
      model_image: this.modelImage,
      garment_image: this.selectedGarment,
      category: 'tops'
    }).subscribe({
      next: (response) => {
        this.statusSubscription?.unsubscribe();
        this.statusSubscription = this.tryOnService.pollStatus(response.id).subscribe({
          next: (status) => {
            if (status.status === 'completed' && status.output?.[0]) {
              this.resultImage = status.output[0];
              this.isProcessing = false;
            }
          },
          error: (error) => {
            console.error('Error polling status:', error);
            this.isProcessing = false;
          }
        });
      },
      error: (error) => {
        console.error('Error starting try-on:', error);
        this.isProcessing = false;
      }
    });
  }

  startGeneration() {
    this.isProcessing = true;
    // Simulate API call
    setTimeout(() => {
      this.isProcessing = false;
      // Set result image when generation is complete
      this.resultImage = 'assets/result.jpg';
    }, 3000);
  }
}