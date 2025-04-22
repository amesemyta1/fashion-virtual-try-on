import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CameraError {
  code: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-camera-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="camera-container">
          <video #videoElement autoplay playsinline class="camera-stream"></video>
          
          <div class="camera-controls">
            <button class="control-button" (click)="onClose()">
              <span class="icon">❌</span>
            </button>
            
            <button class="control-button capture" (click)="capturePhoto()">
              <span class="icon">📸</span>
            </button>
            
            <button class="control-button" (click)="switchCamera()">
              <span class="icon">🔄</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      width: 100%;
      max-width: 600px;
      background: var(--surface-card);
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .camera-container {
      position: relative;
      width: 100%;
      aspect-ratio: 3/4;
      background: black;
    }

    .camera-stream {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .camera-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: var(--spacing-4);
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
    }

    .control-button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .control-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .control-button.capture {
      width: 64px;
      height: 64px;
      background: white;
      color: var(--primary-color);
    }

    .icon {
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 100%;
        height: 100%;
        max-width: none;
        border-radius: 0;
      }

      .camera-container {
        height: 100%;
      }
    }
  `]
})
export class CameraModalComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  @Output() photoTaken = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() error = new EventEmitter<CameraError>();

  private stream: MediaStream | null = null;
  private currentFacingMode: 'user' | 'environment' = 'user';
  private currentError: CameraError | null = null;
  
  // Loading states
  isSwitchingCamera: boolean = false;
  isCapturing: boolean = false;
  isRetaking: boolean = false;
  isProcessing: boolean = false;

  private logError(error: any, action: string) {
    const cameraError: CameraError = {
      code: error.name || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      timestamp: new Date()
    };
    
    console.error(`Camera Error [${action}]:`, {
      error: cameraError,
      details: error
    });
    
    this.currentError = cameraError;
    this.error.emit(cameraError);
  }

  private clearError() {
    this.currentError = null;
  }

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    try {
      this.stopCamera();
      this.clearError();
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (error) {
      this.logError(error, 'START_CAMERA');
      alert('Could not access the camera. Please make sure you have granted camera permissions.');
      this.onClose();
    }
  }

  async switchCamera() {
    if (this.isSwitchingCamera) return;
    
    try {
      this.isSwitchingCamera = true;
      this.clearError();
      this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
      await this.startCamera();
    } catch (error) {
      this.logError(error, 'SWITCH_CAMERA');
    } finally {
      this.isSwitchingCamera = false;
    }
  }

  capturePhoto() {
    if (this.isCapturing) return;
    
    try {
      this.isCapturing = true;
      this.clearError();
      
      const video = this.videoElement.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Failed to get canvas context');
      }
      
      if (this.currentFacingMode === 'user') {
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      const photoData = canvas.toDataURL('image/jpeg');
      this.photoTaken.emit(photoData);
      this.stopCamera();
      this.onClose();
    } catch (error) {
      this.logError(error, 'CAPTURE');
    } finally {
      this.isCapturing = false;
    }
  }

  onClose() {
    try {
      this.clearError();
      this.stopCamera();
      this.close.emit();
    } catch (error) {
      this.logError(error, 'CLOSE_MODAL');
    }
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
} 