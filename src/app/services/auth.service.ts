import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/user';
import {IToken} from '../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;
  private headers: HttpHeaders;

  constructor(
      private http: HttpClient,
      private storage: NativeStorage,
      private env: EnvService
  ) {  }

  private setAuthorizationHeader() {
      this.headers = new HttpHeaders({
          Authorization: `${this.token.token_type} ${this.token.token}`
      });
  }
  login(email: string, password: string) {
    return this.http.post(`${this.env.API_URL}/login`,
        { email, password }
        ).pipe(
          tap( token => {
              // For native storage
            /*this.storage.setItem('token', token).then(
                    () => {
                      console.log(`Token stored`);
                    },
                    error => console.error(`Error storing item`, error)
            );*/
            localStorage.setItem('token', JSON.stringify(token));
            this.token = token as string;
            this.isLoggedIn = true;
            return token;
          })
        );
  }

  register(name: string, email: string, password: string, passwordCofirmed: string) {
    return this.http.post(`${this.env.API_URL}/register`,
        {name, email, password, password_confirmed: passwordCofirmed});
  }

  logout() {
      this.setAuthorizationHeader();
      return this.http.post(`${this.env.API_URL}/logout`, { headers: this.headers })
        .pipe(tap(data => {
          // this.storage.remove('token');
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            delete this.token;
            return data;
        }));
  }

  user() {
      this.setAuthorizationHeader();
      return this.http.post<User>(`${this.env.API_URL}/profile`, { headers: this.headers })
        .pipe(
            tap(user => {
              return user;
            })
        );
  }

  getToken() {
    /*return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if (this.token != null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );*/
    const session = JSON.parse(localStorage.getItem('token')) as IToken;
    if ( session == null) {
        this.isLoggedIn = false;
    } else if (session.token != null) {
        this.isLoggedIn = true;
    } else {
        this.isLoggedIn = false;
    }
  }

}
