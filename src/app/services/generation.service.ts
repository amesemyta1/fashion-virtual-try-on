import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface GenerationError {
  name: string;
  message: string;
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: GenerationError;
}

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  constructor(private http: HttpClient) {}

  checkGenerationStatus(id: string): Observable<GenerationResponse> {
    return this.http.get<GenerationResponse>(`/api/generations/${id}`).pipe(
      catchError(error => {
        console.error('Generation status check failed:', error);
        return throwError(() => error);
      })
    );
  }

  stopGeneration(id: string): Observable<void> {
    return this.http.post<void>(`/api/generations/${id}/stop`, {}).pipe(
      catchError(error => {
        console.error('Failed to stop generation:', error);
        return throwError(() => error);
      })
    );
  }
} 