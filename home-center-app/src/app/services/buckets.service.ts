import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountsService } from './accounts.service';
import { Bucket } from './bucket';
import { BucketContent } from './bucket-content';
import { Resource } from './resource';

@Injectable({
  providedIn: 'root'
})
export class BucketsService {
  private bucketsApi = `${environment.driveApi}/buckets`;
  constructor(
    private client: HttpClient,
    private accountService: AccountsService,

  ) { }

  listBuckets(): Observable<Bucket[]> {
    return this.accountService
    .getAccessToken()
    .pipe(mergeMap((headers) => {
      return this.client.get<Bucket[]>(this.bucketsApi, { headers });
    }));
  }
  
  createBucket(bucketName: string): Observable<Bucket> {
    return this.accountService.getAccessToken()
      .pipe(mergeMap((headers) => {
        return this.client.post<Bucket>(this.bucketsApi, {bucketName}, {headers});
      }));
  }
  
  createResource(bucketId: string, files: File[]): Observable<Resource> {
    var formData: any = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    return this.accountService.getAccessToken()
    .pipe(mergeMap((headers) => {
      return this.client.post<Resource>(`${this.bucketsApi}/${bucketId}` , formData, {headers});
    }));
  }

  listTrash(): Observable<Resource> {
    return this.accountService
    .getAccessToken()
    .pipe(mergeMap((headers) => {
      return of({
        name: '(ES)_Google Cloud Technical Setup Workshop Deck w_checklist (2).pdf',
        size: 1024,
        url: 'string',
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }))
    .pipe(delay(500));
  }
  
  findSharedResources(): Observable<Resource> {
    return this.accountService
    .getAccessToken()
    .pipe(mergeMap((headers) => {
      return of({
        name: '(ES)_Google Cloud Technical Setup Workshop Deck w_checklist (2).pdf',
        size: 1024,
        url: 'string',
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }))
    .pipe(delay(500));
  }
  findBucketContent(bucketId: string): Observable<BucketContent> {
    return this.accountService.getAccessToken()
      .pipe(mergeMap((headers) => {
        return this.client.get<BucketContent>(`${this.bucketsApi}/${bucketId}`, {headers});
      }));

  }
}
