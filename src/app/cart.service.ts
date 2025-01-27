// cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'https://frontend-ecommerce.alitacode.com/public/api/'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to fetch all cart items based on customer ID
  getAllCartItems(customerId: number): Observable<any> {
    const payload = { "customer_id": customerId };
    return this.http.post(`${this.baseUrl}/temp_order/all`, payload);
  }
}
