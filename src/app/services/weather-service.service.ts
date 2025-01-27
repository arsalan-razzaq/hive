import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '1d4c10d296bc8ebb28e79a98351b70e2';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(location: string): Observable<any> {
    const url = `${this.apiUrl}?q=${location}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }
}
