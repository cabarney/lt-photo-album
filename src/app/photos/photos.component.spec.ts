import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PhotosComponent } from './photos.component';
import { Photo, PhotosService } from '../photos.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let mockService: jasmine.SpyObj<PhotosService>;
  let photoData: Photo[] = [];

  beforeEach(() => {
    for (let i = 0; i < 100; i++) {
      photoData.push({
        id: i,
        title: `Photo ${i}`,
        albumId: i % 10,
        url: `http://url.com/photo${i}.jpg`,
        thumbnailUrl: `http://url.com/photo${i}-thumb.jpg`
      });
    }
    mockService = jasmine.createSpyObj(PhotosService, ['getAllPhotos']);
    mockService.getAllPhotos.and.returnValue(of(photoData));
    
    TestBed.configureTestingModule({
      declarations: [PhotosComponent],
      providers: [{ provide: PhotosService, useValue: mockService }],
      imports: [
        MatPaginatorModule,
        MatCardModule]
    });

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should set up the pagedPhotos observable', fakeAsync(() => { 
    component.ngOnInit();
    let pagedPhotos: Photo[] = []; 
    component.pagedPhotos$.subscribe(photos => {
      pagedPhotos = photos;
    });
    tick();
    expect(pagedPhotos).toEqual(photoData.slice(0, component.pageSize));
  }));

  it('should update on page change', fakeAsync(() => {
    component.ngOnInit();
    let pagedPhotos: Photo[] = [];
    component.pagedPhotos$.subscribe(photos => {
      pagedPhotos = photos;
    });
    component.handlePageEvent({ pageIndex: 1, pageSize: 12, length: 100 });
    tick();
    expect(pagedPhotos).toEqual(photoData.slice(12, 24));
  }));
});
