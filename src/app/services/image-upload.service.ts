import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
  };
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly API_URL = 'https://api.imgbb.com/1/upload';
  private readonly API_KEY = environment.imgbbApiKey;

  constructor(private http: HttpClient) {
    if (!this.API_KEY) {
      console.error('ImgBB API key is not configured!');
    }
  }

  uploadImage(base64Image: string): Observable<string> {
    // Убираем префикс data:image/...;base64, если он есть
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const formData = new FormData();
    formData.append('key', this.API_KEY);
    formData.append('image', base64Data);

    return this.http.post<ImgBBResponse>(this.API_URL, formData).pipe(
      map(response => {
        if (!response.success) {
          throw new Error('Failed to upload image');
        }
        return response.data.url;
      })
    );
  }
} 