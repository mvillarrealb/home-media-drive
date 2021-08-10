import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/app/services/access.token';
import { AccountsService } from 'src/app/services/accounts.service';
import { NewBucketComponent } from '../drive/new-bucket/new-bucket.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

class HomePermission {
  drive: Observable<boolean>;
  trash: Observable<boolean>;
  applications: Observable<boolean>;
  templates: Observable<boolean>;
  transactions: Observable<boolean>;
  orders: Observable<boolean>;
  metrics: Observable<boolean>;
}

class ActiveRoute {
  tenants: boolean;
  accounts: boolean;
  applications: boolean;
  templates: boolean;
  transactions: boolean;
  orders: boolean;
  metrics: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  user$: Observable<AccessToken>;
  
  avatarText: string;
  
  activeRoutes: ActivatedRoute;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AccountsService,
  ) {
    this.user$ = this.authenticationService.user;
  }

  ngOnInit(): void {

  }

  extractAvatarText(name: string, lastName: string): string {
    if (name != null && lastName != null) {
      return name.substring(0, 1) + lastName.substring(0, 1);
    }
    return 'U';
  }

  navigate(item) {
    this.router.navigate([item]);
  }

  logout() {
    this.authenticationService.logout();
  }

  isActive(base: string): boolean {
    return this.router.url.startsWith(`/${base}`);
  }

  editProfile() {
    this.dialog.open(EditProfileComponent, {
      width: '40vw',
      data: this.user$,
    });
  }

  newBucket() {
    this.dialog.open(NewBucketComponent, {
      width: '320px',
      height: '240px',
      data: this.user$,
    });
  }
}
