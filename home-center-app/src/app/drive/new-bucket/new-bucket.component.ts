import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BucketsService } from 'src/app/services/buckets.service';

@Component({
  selector: 'app-new-bucket',
  templateUrl: './new-bucket.component.html',
  styleUrls: ['./new-bucket.component.scss']
})
export class NewBucketComponent implements OnInit {
  isLoading = false;
  bucketForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private bucketService: BucketsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewBucketComponent>
  ) { }

  ngOnInit(): void {
    this.bucketForm = this.formBuilder.group({
      bucket: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([a-z]|[A-Z]|'|á|é|í|ó|ú|ñ|ü|Á|É|Í|Ó|Ú|Ñ|Ü|\s|\'|\-)+$/)
      ])
    });
  }

  get bucket() {
    return this.bucketForm.get('bucket');
  }
  
  getBucketErrors() {
    if (this.bucket.hasError('required')) {
      return 'Debe asignar un nombre a la carpeta';
    }
    return this.bucket.hasError('pattern') ? 'Valores incorrectos' : '';
  }

  createBucket() {
    if (this.bucketForm.valid) {
      const { bucket } = this.bucketForm.getRawValue();
      this.isLoading = true;
      this.bucketService
        .createBucket(bucket)
        .subscribe((bucketData) => {
          this.isLoading = false;
          this.closeDialog();
          this.snackBar.open('Carpeta creada exitosamente', 'Cerrar', {
            duration: 3500
          });
        }, ({ message, details }) => {
          const messageDetail = message || `Error creando la carpeta solicitada`;
          this.isLoading = false;
          this.closeDialog();
          this.snackBar.open(messageDetail, 'Cerrar', {
            duration: 3500
          });
        });
    }
  }

  private closeDialog() {
    this.dialogRef.close();
  }
}
