import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Bucket } from '../services/bucket';
import { BucketsService } from '../services/buckets.service';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {
  buckets$: Observable<Bucket[]>;
  constructor(
    private bucketService: BucketsService,
  ) { }

  ngOnInit(): void {
    this.buckets$ = this.bucketService.listBuckets();
  }

}
