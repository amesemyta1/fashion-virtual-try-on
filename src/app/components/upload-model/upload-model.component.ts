import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';

@Component({
  selector: 'app-upload-model',
  standalone: true,
  imports: [CommonModule, CameraModalComponent],
  template: `
    <div class="card">
      <h2 class="section-title">
        <span class="icon">👤</span>
        Upload Model Photo
      </h2>
      
      <div class="upload-area" [class.has-image]="modelImage" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
        <ng-container *ngIf="!modelImage">
          <div class="upload-placeholder">
            <div class="upload-icon">
              <span class="icon-large">👤</span>
              <div class="icon-small">
                <span>⬆️</span>
              </div>
            </div>
            <p class="upload-text">Drag & drop your photo here or use buttons below</p>
          </div>
        </ng-container>
        
        <img *ngIf="modelImage" 
             [src]="modelImage" 
             alt="Uploaded model" 
             class="preview-image" />
      </div>
      
      <div class="actions">
        <button class="btn btn-secondary" (click)="fileInput.click()">
          <span class="icon">📁</span>
          Choose File
        </button>
        
        <button class="btn btn-primary" (click)="showCamera()">
          <span class="icon">📸</span>
          Take Photo
        </button>
      </div>
      
      <button *ngIf="modelImage" 
              class="btn btn-primary generate-btn"
              [disabled]="isProcessing"
              (click)="onGenerate()">
        <span class="icon">✨</span>
        Generate Try-On
      </button>
      
      <input #fileInput
             type="file"
             accept="image/*"
             style="display: none"
             (change)="onFileSelected($event)" />
    </div>

    <app-camera-modal *ngIf="showCameraModal"
                     (photoTaken)="onPhotoTaken($event)"
                     (close)="showCameraModal = false">
    </app-camera-modal>
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
    }
    
    .upload-area {
      flex: 1;
      min-height: 0;
      background-color: var(--color-background);
      border-radius: var(--border-radius-md);
      border: 2px dashed rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-4);
      position: relative;
      overflow: hidden;
    }

    .upload-area.has-image {
      border-style: solid;
      padding: 0;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-4);
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    .upload-icon {
      position: relative;
      display: inline-block;
    }

    .icon-large {
      font-size: 4rem;
      opacity: 0.5;
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
    }

    .upload-text {
      font-size: 0.875rem;
      max-width: 200px;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-4);
    }

    .generate-btn {
      width: 100%;
    }

    .btn .icon {
      font-size: 1.25rem;
      line-height: 1;
    }
  `]
})
export class UploadModelComponent {
  @Output() modelUploaded = new EventEmitter<string>();
  @Output() processStarted = new EventEmitter<void>();
  @Input() isProcessing: boolean = false;

  modelImage: string | null = null;
  showCameraModal: boolean = false;

  showCamera() {
    this.showCameraModal = true;
  }

  onPhotoTaken(photoData: string) {
    this.modelImage = photoData;
    this.modelUploaded.emit(photoData);
    this.showCameraModal = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.readFile(files[0]);
    }
  }

  private readFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modelImage = e.target?.result as string;
        this.modelUploaded.emit(this.modelImage);
      };
      reader.readAsDataURL(file);
    }
  }

  onGenerate() {
    this.processStarted.emit();
  }
}