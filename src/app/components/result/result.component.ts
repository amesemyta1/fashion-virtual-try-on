import { Component, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerationService, GenerationResponse } from '../../services/generation.service';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-container">
      <div *ngIf="isLoading || isProcessing" class="loading-state">
        <div class="spinner"></div>
        <p>{{ isProcessing ? 'Processing your image...' : 'Generating your virtual try-on...' }}</p>
      </div>

      <div *ngIf="error && !isProcessing" class="error-state">
        <span class="icon">⚠️</span>
        <h3>Generation Failed</h3>
        <p>{{ error.message }}</p>
        <button class="btn btn-primary" 
                (click)="retryGeneration()"
                [disabled]="isProcessing">
          Try Again
        </button>
      </div>

      <img *ngIf="resultImage && !isLoading && !isProcessing" 
           [src]="resultImage" 
           alt="Generated try-on result" 
           class="result-image" />
    </div>
  `,
  styles: [`
    .result-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-background);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    .loading-state {
      text-align: center;
      color: var(--color-text-secondary);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-primary);
      border-top-color: transparent;
      border-radius: 50%;
      margin: 0 auto var(--spacing-4);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state {
      text-align: center;
      color: var(--color-text-primary);
      padding: var(--spacing-4);
    }

    .error-state .icon {
      font-size: 2rem;
      margin-bottom: var(--spacing-3);
      display: block;
    }

    .error-state h3 {
      margin: 0 0 var(--spacing-2);
      font-size: 1.25rem;
    }

    .error-state p {
      margin: 0 0 var(--spacing-4);
      color: var(--color-text-secondary);
    }

    .result-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `]
})
export class ResultComponent implements OnDestroy {
  @Input() isProcessing = false;
  @Input() resultImage: string | null = null;
  
  isLoading = false;
  error: { message: string } | null = null;
  private statusCheckSubscription?: Subscription;
  private currentGenerationId?: string;

  constructor(private generationService: GenerationService) {}

  startGeneration(generationId: string) {
    this.isLoading = true;
    this.error = null;
    this.currentGenerationId = generationId;

    // Poll generation status every 2 seconds
    this.statusCheckSubscription = interval(2000)
      .pipe(
        switchMap(() => this.generationService.checkGenerationStatus(generationId)),
        takeWhile(response => {
          // Continue polling if status is pending or processing
          const shouldContinue = response.status === 'pending' || response.status === 'processing';
          
          // Handle completion or failure
          if (response.status === 'failed') {
            this.handleGenerationError(response);
          } else if (response.status === 'completed') {
            this.handleGenerationSuccess(response);
          }
          
          return shouldContinue;
        }, true) // Include the last value
      )
      .subscribe({
        error: (error) => this.handleGenerationError(error)
      });
  }

  private handleGenerationError(response: GenerationResponse) {
    this.isLoading = false;
    this.error = {
      message: response.error?.message || 'An unexpected error occurred during generation.'
    };
    
    // Stop the generation process if it's still running
    if (this.currentGenerationId) {
      this.generationService.stopGeneration(this.currentGenerationId).subscribe();
    }
  }

  private handleGenerationSuccess(response: GenerationResponse) {
    this.isLoading = false;
  }

  retryGeneration() {
    if (this.currentGenerationId) {
      this.startGeneration(this.currentGenerationId);
    }
  }

  ngOnDestroy() {
    this.statusCheckSubscription?.unsubscribe();
    
    // Stop any ongoing generation when component is destroyed
    if (this.currentGenerationId) {
      this.generationService.stopGeneration(this.currentGenerationId).subscribe();
    }
  }
}