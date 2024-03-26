import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private authService: AuthService) {
    this.LoggedIn$ = this.authService.isLoggedIn();
  }
  storeInfo: StoreInfo | undefined; // Declare a property with the interface type

  ngOnInit(): void {
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
}
