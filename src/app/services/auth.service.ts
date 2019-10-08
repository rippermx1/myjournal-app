import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { EnvService } from "./env.service";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  token: string;
  private headers: HttpHeaders;

  constructor(
      private http: HttpClient,
      private storage: NativeStorage,
      private env: EnvService
  ) {  }

  private setAuthorizationHeader() {
      this.headers = new HttpHeaders({
          'Authorization': `${this.token['token_type']} ${this.token['token']}`
      });
  }
  login(email: string, password: string) {
    return this.http.post(`${this.env.API_URL}/login`,
        { email: email, password: password }
        ).pipe(
          tap( token => {
            this.storage.setItem('token', token).then(
                    () => {
                      console.log(`Token stored`);
                    },
                    error => console.error(`Error storing item`, error)
            );
            this.token = token as string;
            this.isLoggedIn = true;
            return token;
          })
        );
  }

  register(name: string, email: string, password: string, password_cofirmed: string) {
    return this.http.post(`${this.env.API_URL}/register`,
        {name: name, email: email, password: password, password_confirmed: password_cofirmed});
  }

  logout() {
      this.setAuthorizationHeader();
    return this.http.post(`${this.env.API_URL}/logout`, { headers: this.headers })
        .pipe(tap(data => {
          this.storage.remove('token');
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
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  }

}
