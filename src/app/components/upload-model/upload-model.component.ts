import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';

@Component({
  selector: 'app-upload-model',
  standalone: true,
  imports: [CommonModule, CameraModalComponent],
  template: `
    <div class="upload-container">
      <h2 class="section-title">
        <span class="icon">👤</span>
        Upload Model Photo
      </h2>

      <div 
        class="preview-container" 
        [class.has-image]="previewUrl"
        (dragover)="onDragOver($event)"
        (drop)="onDrop($event)"
        (dragleave)="onDragLeave($event)"
      >
        <div class="preview-content">
          <div *ngIf="!previewUrl" class="empty-state">
            <div class="upload-icon">
              <span>+</span>
            </div>
            <p class="empty-message">Drag & drop your photo here or</p>
            <p class="empty-hint">use buttons below</p>
          </div>
          <img *ngIf="previewUrl" [src]="previewUrl" alt="Model preview" class="preview-image">
        </div>
      </div>

      <div class="button-container">
        <label class="upload-button file-button">
          <span class="icon">📁</span>
          Choose File
          <input
            type="file"
            accept="image/*"
            (change)="onFileSelected($event)"
            style="display: none"
          >
        </label>
        <button 
          class="upload-button camera-button" 
          (click)="onTakePhoto()"
        >
          <span class="icon">📸</span>
          Take Photo
        </button>
      </div>

      <button 
        class="generate-button"
        [class.disabled]="!previewUrl"
        [disabled]="!previewUrl"
        (click)="onGenerate()"
      >
        <span class="icon">✨</span>
        Generate Try-On
      </button>
    </div>

    <app-camera-modal
      *ngIf="showCamera"
      (close)="showCamera = false"
      (photoTaken)="onPhotoTaken($event)"
    ></app-camera-modal>
  `,
  styles: [`
    .upload-container {
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
      position: relative;
      border: 2px dashed var(--surface-border);
      transition: all 0.3s ease;
    }

    .preview-container.has-image {
      border-style: solid;
      border-color: var(--primary-color);
    }

    .preview-container.drag-over {
      border-color: var(--primary-color);
      background: var(--surface-hover);
    }

    .preview-content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4);
    }

    .empty-state {
      text-align: center;
      color: var(--text-color-secondary);
    }

    .upload-icon {
      width: 64px;
      height: 64px;
      background: var(--surface-card);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-4);
      font-size: 2rem;
      color: var(--primary-color);
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

    .button-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2);
    }

    .upload-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--surface-hover);
      color: var(--text-color);
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      border: 1px solid var(--surface-border);
      cursor: pointer;
    }

    .upload-button:hover {
      background: var(--surface-card);
      border-color: var(--primary-color);
    }

    .file-button {
      background: var(--surface-ground);
      color: var(--text-color);
    }

    .camera-button {
      background: var(--primary-color);
      color: var(--primary-color-text);
    }

    .generate-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--primary-color);
      color: var(--primary-color-text);
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .generate-button:not(.disabled):hover {
      filter: brightness(1.1);
    }

    .generate-button.disabled {
      background: var(--surface-hover);
      color: var(--text-color-secondary);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.7;
    }

    @media (max-width: 1024px) {
      .preview-container {
        aspect-ratio: 3/4;
      }
    }
  `]
})
export class UploadModelComponent {
  @Output() modelUploaded = new EventEmitter<string>();
  
  previewUrl: string | null = null;
  private base64Data: string | null = null;
  showCamera = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.readFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.readFile(files[0]);
    }
  }

  onTakePhoto() {
    this.showCamera = true;
  }

  onPhotoTaken(photoData: string) {
    this.previewUrl = photoData;
    this.base64Data = photoData;
    this.showCamera = false;
  }

  onGenerate() {
    if (this.base64Data) {
      this.modelUploaded.emit(this.base64Data);
    }
  }

  private readFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        this.previewUrl = e.target.result as string;
        this.base64Data = e.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  }
}