import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

import { environment } from "../../environments/environment"


const BACKEND_DOMAIN = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {

    const authData: AuthData = { email: email, password: password };
    this.http.post<{message: string}>( BACKEND_DOMAIN + "/auth/signup", authData)
      .subscribe(response => {
        console.log(response);
        this.authStatusListener.next(false);
        this.router.navigate(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }


  userLogin(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_DOMAIN + "/auth/login", authData)
    .subscribe(response => {
      console.log("login expire resp "+ response.expiresIn);
      const token = response.token
      this.token = token;
      if (token) {
        const expiresInDuration: number = response.expiresIn;
        this.setTokenTimer(expiresInDuration);

        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

        this.saveTokenData(token, expirationDate, this.userId);
        this.router.navigate(['/']);
        console.log("user" + this.userId);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
    }


    getUserId() {
      return this.userId;
  }

  userLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearTokenData();
    this.router.navigate(['/']);
  }


  autoAuthUser() {
    const authInformation = this.getTokenData();
    if (!authInformation) return;
    console.log("auth infp  "+authInformation.userId);
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(expiresIn);

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setTokenTimer((expiresIn / 1000))

      this.authStatusListener.next(true);
    }
  }

  private setTokenTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.userLogout();
    }, duration * 1000);
  }

  private saveTokenData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearTokenData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getTokenData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) return;

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}
