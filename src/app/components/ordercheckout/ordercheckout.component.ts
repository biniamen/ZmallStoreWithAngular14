import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
export interface CartItem {
  _id: string;
  store_id: string;
  price: number;
  quantity: number;
  // ... include other properties you might need
}
export interface OrderPayload {
  user_id: string;
  server_token: string;
  cart_unique_token: string;
  order_type: number;
  total_distance: number;
  total_time: number;
  store_id: string;
  total_cart_price: number;
  total_item_tax: number;
  total_item_count: number;
  is_user_pick_up_order: boolean;
}
interface Window {
  ['initMap']: () => void;
}
@Component({
  selector: 'app-ordercheckout',
  templateUrl: './ordercheckout.component.html',
  styleUrls: ['./ordercheckout.component.css']
})
export class OrdercheckoutComponent implements OnInit {
  search: string = '';
  suggestions: any[] = [];
  selectedLocation: { latitude: number, longitude: number } | null = null;
  apiKey: string = 'AIzaSyCe_kyN7rQG_nRYmj4ud-lG2-lI_J3LRMg'; // Replace with your actual API key
  scheduledOrderChecked: boolean = false;
  adminUrl = environment.adminUrl;
  latitiude: any
  private autocompleteService: any;

  constructor(private ngZone: NgZone,private http: HttpClient,private toastr: ToastrService,
    private router: Router) { }
  ngOnInit(): void {
    if (typeof google === 'undefined' || !google.maps.places) {
      this.loadGoogleMapsAPI().then(() => {
        this.initializeAutocompleteService();
      });
    } else {
      this.initializeAutocompleteService();
    }
  }


  async loadGoogleMapsAPI(): Promise<void> {
    if (typeof google === 'undefined' || !google.maps) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      return new Promise<void>((resolve) => {
        (window as any)['initMap'] = () => {
          this.initializeAutocompleteService();
        };
      });
    } else {
      return Promise.resolve();
    }
  }
  
  
  initializeAutocompleteService() {
    if (typeof google !== 'undefined' && google.maps.places) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    } else {
      setTimeout(() => {
        this.initializeAutocompleteService();
      }, 3000); // Retry after 3 seconds
    }
  }
  

  onInput(): void {
    if (this.search.length > 2 && this.autocompleteService) {
      this.autocompleteService.getPlacePredictions({ input: this.search }, (predictions: any, status: any) => {
        this.ngZone.run(() => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.suggestions = predictions;
          } else {
            this.suggestions = [];
            console.error('Error getting place predictions:', status);
          }
        });
      });
    } else {
      this.suggestions = [];
      if (!this.autocompleteService) {
        console.error('AutocompleteService is not initialized.');
      }
    }
  }
  
  onSuggestionClick(suggestion: any): void {
    this.search = suggestion.description;
    this.suggestions = [];

    // Fetch latitude and longitude using the Place ID
    const placeId = suggestion.place_id;
    this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCe_kyN7rQG_nRYmj4ud-lG2-lI_J3LRMg&place_id=${placeId}`)
      .subscribe(response => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          this.search = suggestion.description;
          this.suggestions = [];
          this.selectedLocation = { latitude, longitude };
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);
          // Now you have the latitude and longitude values, you can use them as needed.
        }
      });
  }
  
  confirmAddress() {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');
    const payload = {
      "latitude": this.selectedLocation?.latitude,
      "longitude": this.selectedLocation?.longitude,
      "destination_address": this.search,
      "store_id": storeId,
      "server_token": serverToken
    };

    this.http.post(this.adminUrl + '/store/store_change_delivery_address', payload).subscribe((response) => {
      
      if (response) {
        console.log(response)
        this.toastr.success('Location Selected');
        // Optionally update the order list or UI here
      }
    });
  }

  createPayload(): OrderPayload {
    // Get cart data from local storage
    const cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Replace 'cartDataKey' with your actual local storage key

    // Calculate total cart price and item count
    const totalCartPrice = cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalItemCount = cartData.reduce((acc, item) => acc + item.quantity, 0);

    // Construct the payload
    const payload: OrderPayload = {
      user_id: '660975d8ef68722c64810b88', // This should be dynamically set based on the logged-in user
      server_token: 'pfAA10GG2LRjR02gg3rvvFdmujvZdaWt', // This should be fetched from a secure source
      cart_unique_token: 'e3ad310f-d3f7-daa1-92db-a47d39357344', // This can be generated or fetched depending on your logic
      order_type: 2, // Set the order type according to your business logic
      total_distance: 0, // Set this based on your application's needs
      total_time: 0, // Set this based on your application's needs
      store_id: cartData[0].store_id, // Assuming all items in the cart are from the same store
      total_cart_price: totalCartPrice,
      total_item_tax: 0, // Calculate the total tax if applicable
      total_item_count: totalItemCount,
      is_user_pick_up_order: false // Set this based on user's choice
    };
    console.log(payload)
    return payload;
  }
}
