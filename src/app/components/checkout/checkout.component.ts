import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';




@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  apiKey: string = 'AIzaSyCe_kyN7rQG_nRYmj4ud-lG2-lI_J3LRMg'; // Replace with your actual API key
  address!: string;
  map!: google.maps.Map;
  geocoder!: google.maps.Geocoder;
  [x: string]: any;
  @ViewChild(GoogleMap, { static: false })
  public searchElementRef!: ElementRef;


  @ViewChild('search')
  locationControl = new FormControl();
  zoom = 13;
  search: string = '';
  search2: string = '';
  suggestions: any[] = [];
  suggestions2: any[] = [];
  sender_name: string = "";
  sender_email: string = "";
  sender_phone: string = "";
  reciever_name: string = "";
  paid_by : number = 1;
  reciever_email: string = "";
  reciever_phone: string = "";
  checkoutForm: FormGroup;
  private autocompleteService: any;
  selectedLocation: { latitude: number, longitude: number } | null = null;
  recieverLocation: { latitude: number, longitude: number } | null = null;
  center: google.maps.LatLngLiteral = { lat: 9.022736, lng: 38.746799 }; // Addis Ababa coordinates
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    // ...additional options if needed
  };
  constructor(private ngZone: NgZone, private fb: FormBuilder,private http: HttpClient) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      location: [''], // Initialize your form control with an empty string or any default value
      // ... add additional form controls as needed
    });


  }

  ngOnInit(): void {
    this.loadGoogleMapsAPI();
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  async loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCe_kyN7rQG_nRYmj4ud-lG2-lI_J3LRMg&libraries=places`;
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
    await new Promise<void>((resolve) => {
      script.onload = () => {
        resolve();
      };
    });
    this.initializeAutocompleteService();
  }
  initializeAutocompleteService() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
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

  onInput(): void {
    if (this.search.length > 2) {
      this.autocompleteService.getPlacePredictions({ input: this.search }, (predictions: any, status: any) => {
        this.ngZone.run(() => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.suggestions = predictions;
          } else {
            this.suggestions = [];
          }
        });
      });
    } else {
      this.suggestions = [];
    }
  }
}

