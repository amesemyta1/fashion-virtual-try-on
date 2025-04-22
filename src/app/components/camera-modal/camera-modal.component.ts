import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="camera-container">
          <video #video 
                 [class.hidden]="!isStreaming"
                 autoplay 
                 playsinline>
          </video>
          <canvas #canvas 
                  [class.hidden]="isStreaming || !capturedImage"
                  width="640" 
                  height="480">
          </canvas>
          
          <div *ngIf="!hasCamera" class="no-camera">
            <span class="icon">❌</span>
            <p>Camera not available</p>
            <p class="subtext">Please make sure you have a camera connected and have granted permission to use it.</p>
          </div>

          <div *ngIf="currentError" class="error-message">
            <span class="icon">⚠️</span>
            <p>{{ currentError.message }}</p>
          </div>
        </div>
        
        <div class="controls">
          <ng-container *ngIf="hasCamera">
            <button *ngIf="isStreaming" 
                    class="btn btn-secondary"
                    (click)="switchCamera()"
                    [disabled]="isSwitchingCamera">
              <span class="icon">🔄</span>
              {{ isSwitchingCamera ? 'Switching...' : 'Switch Camera' }}
            </button>
            
            <button *ngIf="isStreaming" 
                    class="btn btn-primary"
                    (click)="capture()"
                    [disabled]="isCapturing">
              <span class="icon">📸</span>
              {{ isCapturing ? 'Capturing...' : 'Take Photo' }}
            </button>
            
            <ng-container *ngIf="!isStreaming">
              <button class="btn btn-secondary"
                      (click)="retake()"
                      [disabled]="isRetaking">
                <span class="icon">🔄</span>
                {{ isRetaking ? 'Resetting...' : 'Retake' }}
              </button>
              
              <button class="btn btn-primary"
                      (click)="accept()"
                      [disabled]="isProcessing">
                <span class="icon">✅</span>
                {{ isProcessing ? 'Processing...' : 'Accept' }}
              </button>
            </ng-container>
          </ng-container>
          
          <button class="btn btn-secondary" 
                  (click)="closeModal()"
                  [disabled]="isProcessing">
            <span class="icon">❌</span>
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: var(--color-card-bg);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-4);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .camera-container {
      position: relative;
      width: 640px;
      height: 480px;
      background-color: var(--color-background);
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }

    video, canvas {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hidden {
      display: none;
    }

    .no-camera {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: var(--color-text-secondary);
    }

    .no-camera .icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-4);
      display: block;
    }

    .no-camera .subtext {
      font-size: 0.875rem;
      opacity: 0.7;
      max-width: 300px;
      margin-top: var(--spacing-2);
    }

    .controls {
      display: flex;
      gap: var(--spacing-3);
      justify-content: center;
    }

    .btn .icon {
      font-size: 1.25rem;
      line-height: 1;
    }

    .error-message {
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(255, 0, 0, 0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10;
    }

    .error-message .icon {
      font-size: 1.25rem;
    }

    .error-message p {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class CameraModalComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  @Output() photoTaken = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() error = new EventEmitter<CameraError>();

  hasCamera: boolean = true;
  isStreaming: boolean = true;
  capturedImage: string | null = null;
  currentError: CameraError | null = null;
  
  // Loading states
  isSwitchingCamera: boolean = false;
  isCapturing: boolean = false;
  isRetaking: boolean = false;
  isProcessing: boolean = false;

  private stream: MediaStream | null = null;
  private isFrontCamera: boolean = true;

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

  async ngOnInit() {
    try {
      await this.startCamera();
    } catch (error) {
      this.logError(error, 'INITIALIZATION');
    }
  }

  private async startCamera() {
    try {
      this.stopStream();
      this.clearError();
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: this.isFrontCamera ? 'user' : 'environment'
        }
      });
      
      this.videoElement.nativeElement.srcObject = this.stream;
      this.hasCamera = true;
      this.isStreaming = true;
    } catch (error) {
      this.logError(error, 'START_CAMERA');
      this.hasCamera = false;
      this.isStreaming = false;
      throw error;
    }
  }

  async switchCamera() {
    if (this.isSwitchingCamera) return;
    
    try {
      this.isSwitchingCamera = true;
      this.clearError();
      await this.startCamera();
    } catch (error) {
      this.logError(error, 'SWITCH_CAMERA');
    } finally {
      this.isSwitchingCamera = false;
    }
  }

  capture() {
    if (this.isCapturing) return;
    
    try {
      this.isCapturing = true;
      this.clearError();
      
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Failed to get canvas context');
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/jpeg');
      this.stopStream();
      this.isStreaming = false;
    } catch (error) {
      this.logError(error, 'CAPTURE');
    } finally {
      this.isCapturing = false;
    }
  }

  async retake() {
    if (this.isRetaking) return;
    
    try {
      this.isRetaking = true;
      this.clearError();
      await this.startCamera();
      this.capturedImage = null;
    } catch (error) {
      this.logError(error, 'RETAKE');
    } finally {
      this.isRetaking = false;
    }
  }

  accept() {
    if (this.isProcessing || !this.capturedImage) return;
    
    try {
      this.isProcessing = true;
      this.clearError();
      
      // Emit the captured image
      this.photoTaken.emit(this.capturedImage);
      
      // Simulate API call
      const apiResponse = { error: null };
      if (apiResponse.error) {
        throw new Error(apiResponse.error);
      }
      
      this.closeModal();
    } catch (error) {
      this.logError(error, 'ACCEPT');
    } finally {
      this.isProcessing = false;
    }
  }

  closeModal() {
    try {
      this.clearError();
      this.stopStream();
      this.close.emit();
    } catch (error) {
      this.logError(error, 'CLOSE_MODAL');
    }
  }

  ngOnDestroy() {
    this.stopStream();
  }

  private stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
} 