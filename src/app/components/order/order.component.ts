import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})

export class OrderComponent implements OnInit {
  adminUrl = environment.adminUrl;
  responseData: any;
  newOrder: any[] = [];  // Holds orders of type 1
  AcceptedOrder: any[] = [];  // Holds orders of type 3
  OrderPreparing: any[] = []

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

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
    this.http.post<any>(this.adminUrl + '/store/order_list_search_sort', payload)
    .subscribe((response) => {
      this.responseData = response;
      if (this.responseData && this.responseData.orders) {
        this.newOrder = this.responseData.orders.filter((order: { order_status: number; }) => order.order_status === 1);
        this.AcceptedOrder = this.responseData.orders.filter((order: { order_status: number; }) => order.order_status === 3);
        this.OrderPreparing = this.responseData.orders.filter((order: { order_status: number; }) => order.order_status === 5);

      }
      console.log(this.responseData);
    });
  }
  // Accepting Order
  acceptOrder(order: any) {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');
    const payload = {
      store_id: storeId,
      server_token: serverToken,
      order_id: order._id,
      order_status: 3 // Assuming '3' is the status code for 'accepted'
    };

    this.http.post(this.adminUrl + '/store/set_order_status', payload).subscribe((response) => {
      console.log('Order approved', response);
      if (response) {
        this.toastr.success('Order Accepted');
        // Optionally update the order list or UI here
        this.getOrder(); // Implement this method to refresh the order list or update UI
      }
    });
  }

}
