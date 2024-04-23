import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  private autocompleteService: any;

  constructor(private ngZone: NgZone,private http: HttpClient,private toastr: ToastrService,
    private router: Router) { }
  ngOnInit(): void {
    this.loadGoogleMapsAPI();
    this.initializeAutocompleteService();
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
    if (typeof google !== 'undefined' && google.maps.places) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }
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
}
