import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit, AfterViewInit {
  deliveryList: any[] = [];
  selectedDelivery: any;
  storeId = localStorage.getItem('store_id');
  serverToken = localStorage.getItem('server_token');
  searchPayload = {
    store_id: this.storeId,
    server_token: this.serverToken,
    request_status: '',
    search_field: 'user_detail.first_name',
    search_value: '',
    page: 1
  };

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef | undefined;
  map: google.maps.Map | undefined;

  private apiUrl = 'https://test.zmallapp.com/api/store/delivery_list_search_sort';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getDeliveryList();
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  getDeliveryList(): void {
    this.http.post<any>(this.apiUrl, this.searchPayload).subscribe(response => {
      if (response.success) {
        this.deliveryList = response.requests;
        if (this.deliveryList.length > 0) {
          this.selectedDelivery = this.deliveryList[0];
          this.mapInitializer();
        }
      }
    });
  }

  viewDetails(delivery: any): void {
    this.selectedDelivery = delivery;
    this.mapInitializer();
  }

  cancelOrder(delivery: any): void {
    // Implement cancel order functionality
  }

  mapInitializer() {
    if (!this.selectedDelivery || !this.gmap) return;

    const location = this.selectedDelivery.destination_addresses[0].location;
    const coordinates = new google.maps.LatLng(location[0], location[1]);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 15
    };
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

    new google.maps.Marker({
      position: coordinates,
      map: this.map
    });
  }

  updateSearchValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchPayload.search_value = inputElement.value;
  }
}
