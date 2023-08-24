import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { PhotosService } from './photos.service';

describe('PhotosService', () => {
  let service: PhotosService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllPhotos should call the right endpoint for all photos', () => {
    service.getAllPhotos().subscribe(data => {
      expect(data).toEqual([]);
    });
    const req = httpTestingController.expectOne(PhotosService.API_URL);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  })
});
