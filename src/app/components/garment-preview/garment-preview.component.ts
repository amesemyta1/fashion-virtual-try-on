import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-garment-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2 class="section-title">
        <span class="icon">👕</span>
        Garment Preview
      </h2>
      
      <div class="garment-display" [class.empty]="!selectedGarment">
        <ng-container *ngIf="selectedGarment">
          <img 
            [src]="selectedGarment" 
            alt="Garment preview" 
            class="garment-image"
            (error)="handleImageError($event)"
          />
        </ng-container>
        
        <div *ngIf="!selectedGarment" class="placeholder">
          <div class="placeholder-content">
            <div class="placeholder-icon">
              <span class="icon-large">👕</span>
              <div class="icon-small">
                <span>🔍</span>
              </div>
            </div>
            <div class="placeholder-text">
              <h3>No Garment Selected</h3>
              <p>Add a garment URL to preview it here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--color-card-bg);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-4);
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .section-title {
      color: var(--color-text-primary);
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-3);
    }

    .section-title .icon {
      font-size: 1.25rem;
      line-height: 1;
    }
    
    .garment-display {
      background-color: var(--color-background);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      min-height: 0;
      padding: var(--spacing-4);
    }

    .garment-display.empty {
      background-color: rgba(255, 255, 255, 0.02);
      border: 2px dashed rgba(255, 255, 255, 0.1);
    }
    
    .garment-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-4);
      color: rgba(255, 255, 255, 0.5);
      max-width: 240px;
      text-align: center;
    }

    .placeholder-icon {
      position: relative;
      display: inline-block;
    }

    .icon-large {
      font-size: 4rem;
      opacity: 0.5;
      display: block;
      line-height: 1;
    }

    .icon-small {
      position: absolute;
      bottom: -0.5rem;
      right: -0.5rem;
      background: var(--color-primary);
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .icon-small span {
      font-size: 1rem;
      line-height: 1;
    }

    .placeholder-text {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .placeholder-text h3 {
      font-size: 1rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
    }

    .placeholder-text p {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }
  `]
})
export class GarmentPreviewComponent {
  @Input() selectedGarment: string = '';
  @Output() garmentSelected = new EventEmitter<string>();

  handleImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    this.selectedGarment = '';
  }
}