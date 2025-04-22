import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TryOnRequest {
  model_image: string;
  garment_image: string;
  category: string;
}

export interface TryOnResponse {
  id: string;
  error: string | null;
}

export interface TryOnStatus {
  id: string;
  status: 'processing' | 'completed';
  output?: string[];
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TryOnService {
  private readonly API_URL = 'https://api.fashn.ai/v1';
  private readonly API_KEY = environment.apiKey;

  constructor(private http: HttpClient) {
    if (!this.API_KEY) {
      console.error('API key is not configured!');
    }
  }

  startTryOn(request: TryOnRequest): Observable<TryOnResponse> {
    return this.http.post<TryOnResponse>(`${this.API_URL}/run`, request, {
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getStatus(id: string): Observable<TryOnStatus> {
    return this.http.get<TryOnStatus>(`${this.API_URL}/status/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`
      }
    });
  }

  // Вспомогательный метод для polling статуса с интервалом
  pollStatus(id: string): Observable<TryOnStatus> {
    return interval(2000).pipe(
      switchMap(() => this.getStatus(id)),
      takeWhile(response => response.status === 'processing' || !response.error, true)
    );
  }
} 