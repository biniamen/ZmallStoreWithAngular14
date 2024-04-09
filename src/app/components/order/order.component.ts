import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  adminUrl = environment.adminUrl;
  responseData: any;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
      this.getOrder();
  }

  getOrder() {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');

    const payload = {
      store_id: storeId,
      server_token: serverToken,
      payment_mode: '',
      order_type: '',
      pickup_type: '',
      search_field: 'user_detail.first_name',
      search_value: '',
      page: 1,
    };
    this.http
      .post(this.adminUrl + '/store/order_list_search_sort', payload)
      .subscribe((response) => {
        this.responseData = response;
        const storeInfoString = localStorage.getItem('store_info');
        //this.currency_sign = this.responseData.currency_sign
        //this.responseData = Object.values(this.responseData)
        console.log(this.responseData);
      });
  }
}
