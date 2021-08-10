import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriveContentComponent } from './drive-content/drive-content.component';
import { DriveComponent } from './drive.component';
import { SharedComponent } from './shared/shared.component';
import { TrashComponent } from './trash/trash.component';

const routes: Routes = [
  {
    path: '', component: DriveComponent, pathMatch: 'full',
  },
  {
    path: ':bucketId/content',
    component: DriveContentComponent
  },
  {
    path: 'trash',
    component: TrashComponent
  },
  {
    path: 'shared',
    component: SharedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriveRoutingModule { }
