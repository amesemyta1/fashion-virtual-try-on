import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-container">
      <h2 class="section-title">
        <span class="icon">✨</span>
        Result
      </h2>

      <div class="preview-container" [class.has-result]="resultImage">
        <div class="preview-content">
          <div *ngIf="isLoading" class="status-message">
            <div class="spinner"></div>
            <p>Uploading images...</p>
          </div>

          <div *ngIf="isProcessing" class="status-message">
            <div class="spinner"></div>
            <p>Generating try-on result...</p>
          </div>

          <div *ngIf="error" class="error-message">
            <span class="icon">⚠️</span>
            <p>{{ error }}</p>
          </div>

          <div *ngIf="!isLoading && !isProcessing && !error && !resultImage" class="empty-state">
            <p class="empty-message">No Result Yet</p>
            <p class="empty-hint">Select a garment and upload a model image to see the result</p>
          </div>

          <img *ngIf="resultImage" [src]="resultImage" alt="Try-on result" class="result-image">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .result-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      background: var(--surface-card);
      border-radius: var(--border-radius);
      padding: var(--spacing-4);
    }

    .section-title {
      color: var(--text-color);
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .icon {
      font-size: 1.25rem;
    }

    .preview-container {
      flex: 1;
      background: var(--surface-ground);
      border-radius: var(--border-radius);
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .preview-container.has-result {
      border-style: solid;
      border-color: var(--primary-color);
    }

    .preview-content {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4);
    }

    .empty-state {
      text-align: center;
      color: var(--text-color-secondary);
    }

    .empty-message {
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 var(--spacing-2);
    }

    .empty-hint {
      font-size: 0.875rem;
      margin: 0;
      opacity: 0.8;
    }

    .status-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-4);
      color: var(--text-color-secondary);
      text-align: center;
    }

    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--red-500);
      text-align: center;
    }

    .error-message .icon {
      font-size: 2rem;
    }

    .error-message p {
      margin: 0;
      font-size: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--surface-border);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .result-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 1024px) {
      .preview-container {
        aspect-ratio: 3/4;
      }
    }
  `]
})
export class ResultComponent {
  @Input() isLoading = false;
  @Input() isProcessing = false;
  @Input() resultImage: string | null = null;
  @Input() error: string | null = null;
}