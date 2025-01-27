import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logout() {
    throw new Error('Method not implemented.');
  }
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }

  private baseUrl = 'https://demo4.alitacode.com/frontend/public/api';
  isAuthenticated(): boolean {
    const token = localStorage.getItem('bearer_token');
    return token !== null && token !== undefined;
  }
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const url = `${this.baseUrl}login`;
    return this.http.post(url, { email, password });
  }
  forgotPassword(email: string) {
    const url = `${this.baseUrl}forget_password`;
    return this.http.post(url, { email });
  }
  forgotSendMail(email: string) {
    const url = `${this.baseUrl}sendEmail`;
    return this.http.post(url, { email });
  }
  emailOTP(email: string , verify_password: string) {
    const url = `${this.baseUrl}verify`;
    return this.http.post(url, { email ,verify_password });
  }
  newPassword(email: string , password: string) {
    const url = `${this.baseUrl}update_password`;
    return this.http.post(url, { email ,password });
  }
  isLoggedIn() {
    const url = `${this.baseUrl}/user`;
    return this.http.get(url);
  }
}
