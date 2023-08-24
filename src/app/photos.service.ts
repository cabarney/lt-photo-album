import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  static readonly API_URL = 'https://jsonplaceholder.typicode.com/photos';
  constructor(public http: HttpClient) { }

  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(PhotosService.API_URL);
  }
}


export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}