import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BucketContent } from 'src/app/services/bucket-content';
import { BucketsService } from 'src/app/services/buckets.service';
import { Resource } from 'src/app/services/resource';

@Component({
  selector: 'app-drive-content',
  templateUrl: './drive-content.component.html',
  styleUrls: ['./drive-content.component.scss']
})
export class DriveContentComponent implements OnInit {
  bucketContent$: Observable<BucketContent>;
  isLoading: boolean = false;
  bucketId: string;
  selectedResource: Resource;
  resourceSelected = false;
  constructor(
    private route: ActivatedRoute,
    private bucketService: BucketsService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    if (params.get('bucketId')) {
      this.bucketId = params.get('bucketId');
      this.bucketContent$ = this.bucketService.findBucketContent(params.get('bucketId'));
    }
  }

  handleSelection(resource: Resource) {
    if(resource != null) {
      this.selectedResource = resource;
      this.resourceSelected = true;
    }
  }

  onFileDropped(files: File[]){
    this.isLoading = true;
    this.bucketService
      .createResource(this.bucketId, files)
      .subscribe((fileData) => {
        this.isLoading = false;
        this.snackBar.open('Archivos cargado exitosamente', 'Cerrar', {
          duration: 3500
        });
      }, ({ message, details }) => {
        const messageDetail = message || `Error cargando los archivo seleccionados`;
        this.isLoading = false;
        this.snackBar.open(messageDetail, 'Cerrar', {
          duration: 3500
        });
      });
  }
  viewInformation() {
    if(this.selectedResource != null) {
      console.log(this.selectedResource);
    }
  }

  deleteResource() {
    if(this.selectedResource != null) {
      console.log(this.selectedResource);
    }
  }

  onSelectionChange(event) {
    console.log(event);
  }

  onFileSelected(event) {
    const { files } = event.target;
    if(files && files.length > 0) {
      let fileArray = [];
      for(let i = 0; i < files.length;i++) {
        fileArray.push(files[i]);
      }
      this.onFileDropped(fileArray);
    }
  }

  mimeIsSupported(mimeType: string): boolean {
    return true;
  }

}
