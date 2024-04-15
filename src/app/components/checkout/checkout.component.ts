import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';




@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  address!: string;
  map!: google.maps.Map;
  geocoder!: google.maps.Geocoder;
  [x: string]: any;
  @ViewChild(GoogleMap, { static: false }) 
  public searchElementRef!: ElementRef;

  @ViewChild('search')
  locationControl = new FormControl();
  zoom = 13;

  checkoutForm: FormGroup;
  center: google.maps.LatLngLiteral = { lat: 9.022736, lng: 38.746799 }; // Addis Ababa coordinates
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    // ...additional options if needed
  };
  constructor(private ngZone: NgZone, private fb: FormBuilder) {
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
    // Assuming google is available globally, otherwise you need to load the Google Maps script with API key
    this.initMap();
    this.geocoder = new google.maps.Geocoder();
  }

  initMap(): void {
    const mapOptions = {
      zoom: 8,
      center: { lat: -1.286389, lng: 36.817223 }, // Default center
    };
    // Using the non-null assertion operator to assure that the element is not null.
    this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);

    // Map click event
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      // Ensure that the event has a latLng property
      if (event.latLng) {
        this.findAddress(event.latLng.toJSON());
      }
    });
  }


  geocodeAddress(): void {
    this.geocoder.geocode({ 'address': this.address }, (results, status) => {
      if (status === 'OK' && results) { // Check if results is not null
        this.map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  findAddress(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void {
  this.geocoder.geocode({ 'location': latLng }, (results, status) => {
    if (status === 'OK' && results) { // Check if results is not null
      this.address = results[0].formatted_address;
      // Update the address input field
      this.map.setCenter(latLng);
    } else if (status === 'ZERO_RESULTS') {
      window.alert('No results found');
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
  placeOrder() {
    // Implement logic to place order with the user information
    //console.log(this.userInfo);
  }
  mapClicked($event: google.maps.MapMouseEvent) {
    if ($event.latLng) {
      this.center = {
        lat: $event.latLng.lat(),
        lng: $event.latLng.lng()
      };
      // Convert lat/lng to address here and update location control
    }
  }
  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Process checkout data here
      console.log(this.checkoutForm.value);
    }
  }
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Now, use Google Maps Geocoding API or Places API to get the address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          this.ngZone.run(() => {
            this['locationForm'].get('location').setValue(results[0].formatted_address);
          });
        }
      });
    }
  }

}

