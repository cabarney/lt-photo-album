import { Component, OnInit } from '@angular/core';
import { Photo, PhotosService } from '../photos.service';
import { BehaviorSubject, Observable, combineLatestWith, map, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  pageSize = 12;
  gallerySize = 0;
  pagedPhotos$ = new Observable<Photo[]>();
  pageIndex$ = new BehaviorSubject<number>(0);

  constructor(public service: PhotosService) { 
  }
  ngOnInit(): void {
    this.pagedPhotos$ = this.service.getAllPhotos().pipe(
      tap(photos => this.gallerySize = photos.length),
      switchMap(photos => this.pageIndex$.pipe(
        map(page => photos.slice(page * this.pageSize, (page + 1) * this.pageSize))
      ))
    );
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex$.next(e.pageIndex);
  }
}
