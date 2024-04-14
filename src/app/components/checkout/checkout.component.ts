import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('search')
  public searchElementRef!: ElementRef;
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
  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      // ... add additional form controls as needed
    });
  }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.center = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          this.locationControl.setValue(place.formatted_address);
        });
      });
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
}
