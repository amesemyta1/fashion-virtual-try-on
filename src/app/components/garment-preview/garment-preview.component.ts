import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-garment-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="garment-preview">
      <h2 class="section-title">
        <span class="icon">👕</span>
        Garment Preview
      </h2>

      <div class="preview-container" [class.has-garment]="garmentUrl">
        <div class="preview-content">
          <div *ngIf="!garmentUrl" class="empty-state">
            <p class="empty-message">No Garment Selected</p>
            <p class="empty-hint">Add a garment URL to preview it here</p>
          </div>
          <img *ngIf="garmentUrl" [src]="garmentUrl" alt="Selected garment" class="preview-image">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .garment-preview {
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

    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    @media (max-width: 1024px) {
      .preview-container {
        aspect-ratio: 3/4;
      }
    }
  `]
})
export class GarmentPreviewComponent {
  @Input() garmentUrl: string | null = null;
}