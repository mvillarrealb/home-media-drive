import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AccessToken } from './access.token';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  
  private userSubject: BehaviorSubject<AccessToken>;

  public user: Observable<AccessToken>;
  
  private refreshTokenApi = `${environment.driveApi}/oauth/token`;
  
  private loginApi = `${environment.driveApi}/accounts/signin`;
  
  private registerApi = `${environment.driveApi}/accounts/signup`;

  private accountsApi = `${environment.driveApi}/accounts`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.userSubject = new BehaviorSubject<AccessToken>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable().pipe(shareReplay(1));
  }

  getAccessToken(): Observable<HttpHeaders> {
    return this.user
      .pipe(mergeMap((user) => {
        if (user == null) {
          this.router.navigate(['/accounts/signin']);
        } else if (this.isExpired(user)) {
          console.log('Access Token expired');
          return this.refreshToken(user);
        }
        return new Observable<AccessToken>(s => s.next(user));
      }))
      .pipe(map((user) => {
        return new HttpHeaders({
          authorization: `Bearer ${user.accessToken}`,
          'x-request-id': new Date().toISOString()
        });
      }))
      .pipe(take(1));
  }

  isExpired(user: AccessToken) {
    const { expiresAt } = user;
    const currentDateTime = new Date();
    return currentDateTime > new Date(expiresAt);
  }

  refreshToken(token: AccessToken): Observable<AccessToken> {
    return this.http.post<AccessToken>(this.refreshTokenApi, {
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken
    }).pipe(map((refreshedToken) => {
      localStorage.setItem('user', JSON.stringify(refreshedToken));
      this.userSubject.next(refreshedToken);
      return refreshedToken;
    })).pipe(catchError((error) => {
      console.log(`Error refreshing access Token`);
      localStorage.removeItem('user');
      this.userSubject.next(null);
      return new Observable<AccessToken>(s => s.next(null));
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AccessToken>(this.loginApi, { email, password })
      .pipe(map((user, b) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  changePassword(password: string): Observable<User> {
    return this.getAccessToken().pipe(mergeMap((headers) => {
      return this.http.post<User>(`${this.accountsApi}/@me/password`, { password }, { headers });
    }));
  }

  editAccount(name: string, lastName: string): Observable<User> {
    return this.getAccessToken().pipe(mergeMap((headers) => {
      return this.http.post<User>(`${this.accountsApi}/@me`, { name, lastName }, { headers });
    }));
  }

  updateIdentity(user: User): Observable<void> {
    return this.user
      .pipe(take(1))
      .pipe(map((token) => {
        token.payload.name = user.name;
        token.payload.lastName = user.lastName;
        localStorage.setItem('user', JSON.stringify(token));
        return this.userSubject.next(token);
      }));
  }

  assignActions(userId: string, actions: string[]) {
    return this.getAccessToken().pipe(mergeMap((headers) => {
      return this.http.post<User>(`${this.accountsApi}/${userId}/actions`, actions, { headers });
    }));
  }

  signup(email: string, password: string) {
    return this.http.post(this.registerApi, { email, password });
  }

  hasRole(role: string): Observable<boolean> {
    return this.user
      .pipe(take(1))
      .pipe(mergeMap((token) => {
        const roles = token
          .roles
          .filter(action => action.role.startsWith(role));
        const hasRole = (roles.length > 0);
        return new Observable<boolean>(s => s.next(hasRole));
      }))
      .pipe(shareReplay(1));
  }

  public get userValue(): AccessToken {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/accounts/login']);
  }
}
