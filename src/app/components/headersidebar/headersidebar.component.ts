import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
export interface StoreInfo {
  _id: string;
  unique_id: number;
  updated_at: string;
  // ... include all other properties you need
  name: string;
  address: string;
  phone: string;
  email: string;
  // ... any other fields you want to access
}
@Component({
  selector: 'app-headersidebar',
  templateUrl: './headersidebar.component.html',
  styleUrls: ['./headersidebar.component.css']
})
export class HeadersidebarComponent implements OnInit {

  LoggedIn$: Observable<boolean>;
  adminUrl = environment.adminUrl;
  newIncommingOrder: any = []
  notifyNewOrder: any = []
  notifyNewOrderData: any = []
  notifyNewOrderCount: number = 0;
  private intervalId: any;
  constructor(private authService: AuthService,private http: HttpClient,private toastr: ToastrService) {
    this.LoggedIn$ = this.authService.isLoggedIn();
  }
  storeInfo: StoreInfo | undefined; // Declare a property with the interface type

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.order_list_search_sort();
      this.store_notify_new_order();
    }, 10000); // 10000 ms = 10 seconds
    this.getStoreInfo();
    //console.log(this.LoggedIn$)
  }

  onLogout(): void {
    this.authService.logout();
  }
  getStoreInfo(): void {
    const storeInfoJSON = localStorage.getItem('store_info');
    if (storeInfoJSON) {
      this.storeInfo = JSON.parse(storeInfoJSON);
    } else {
      console.error('Store information not found in local storage.');
    }
  }

  store_notify_new_order() {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');
    const payload = {
      store_id: storeId,
      server_token: serverToken,
    };

    this.http.post(this.adminUrl + '/store/store_notify_new_order', payload).subscribe(response => {
      this.newIncommingOrder = response;
      if (!this.newIncommingOrder.success && this.newIncommingOrder.error_code === 999) {
        this.toastr.error('Token Expire.', 'Error!');
        this.onLogout();
      } else {
     //   console.log(this.newIncommingOrder);
        // Handle successful response
      }
     // console.log(this.newIncommingOrder);
    });
  }
  order_list_search_sort() {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');
    const payload = {
      store_id: storeId,
      server_token: serverToken,
      payment_mode: "",
      order_type: "",
      pickup_type: "",
      search_field: "user_detail.first_name",
      search_value: "",
      page: 1
    };

    this.http.post(this.adminUrl + '/store/order_list_search_sort', payload).subscribe(response => {
      this.notifyNewOrder = response;
      if (this.notifyNewOrder.success) {
        this.notifyNewOrderData = this.notifyNewOrder.orders;
        this.notifyNewOrderCount = this.notifyNewOrderData.length;
       // console.log(this.notifyNewOrderCount)
      } else {
      //  console.log(this.newIncommingOrder);
        // Handle successful response
      }

      //console.log(this.notifyNewOrder);
    });
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
