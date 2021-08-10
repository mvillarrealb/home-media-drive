import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveRoutingModule } from './drive-routing.module';
import { NewBucketComponent } from './new-bucket/new-bucket.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DriveComponent } from './drive.component';
import { MatCardModule } from '@angular/material/card';
import { DriveContentComponent } from './drive-content/drive-content.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { DropDirective } from '../directives/drop.directive';
import { SharedComponent } from './shared/shared.component';
import { TrashComponent } from './trash/trash.component';


@NgModule({
  declarations: [DropDirective, NewBucketComponent, DriveComponent, DriveContentComponent, SharedComponent, TrashComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatProgressBarModule,
    DriveRoutingModule
  ]
})
export class DriveModule { }
