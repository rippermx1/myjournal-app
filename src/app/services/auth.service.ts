import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { User } from '../models/user';
import {IToken} from '../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: IToken;
  // private headers: HttpHeaders;

  constructor(
      private http: HttpClient,
      private envService: EnvService
  ) {  }

  /*private setAuthorizationHeader() {
      this.token = this.getToken() || null;
      this.headers = new HttpHeaders({
          Authorization: `${this.token.token_type} ${this.token.token}`
      });

  }*/
  login(email: string, password: string) {
    return this.http.post(`${this.envService.API_URL}/login`,
        { email, password }
        ).pipe(
          tap( token => {
            localStorage.setItem('token', JSON.stringify(token));
            this.isLoggedIn = true;
            return token;
          })
        );
  }

  register(name: string, email: string, password: string, passwordCofirmed: string) {
    return this.http.post(`${this.envService.API_URL}/register`,
        {name, email, password, password_confirmed: passwordCofirmed});
  }

  logout() {
      // this.setAuthorizationHeader();
      return this.http.post(`${this.envService.API_URL}/logout`, null/*, { headers : this.headers}*/ )
        .pipe(tap(data => {
            localStorage.removeItem('token');
            sessionStorage.removeItem(('user'));
            this.isLoggedIn = false;
            return data;
        }));
  }

  profile() {
      // this.setAuthorizationHeader();
      return this.http.post<User>(`${this.envService.API_URL}/profile`, null/*, { headers: this.headers }*/)
        .pipe(
            tap(user => {
                return user;
            })
        );
  }

  validateSession() {
    const session = this.getToken();
    if ( session == null) {
        this.isLoggedIn = false;
    } else if (session.token != null) {
        this.isLoggedIn = true;
    } else {
        this.isLoggedIn = false;
    }
  }

  getToken() {
      const token = JSON.parse(localStorage.getItem('token')) as IToken;
      if ( token != null ) {
          return token;
      }
  }

  getSessionUser() {
      const user = JSON.parse(sessionStorage.getItem('user')) as User;
      if ( user != null ) {
          return user;
      }
  }


}
