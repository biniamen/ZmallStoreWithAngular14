import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'https://test.zmallapp.com/api/store/delivery_list_search_sort';

  constructor(private http: HttpClient) { }

  getDeliveryList(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
