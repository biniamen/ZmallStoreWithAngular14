import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface StoreDetail {
  _id: string;
  unique_id: number;
  updated_at: string;
  store_type: number;
  admin_type: number;
  company_id: number;
  country_id: string;
  city_id: string;
  location: number[];
  created_at: string;
  server_token: string;
  is_referral: boolean;
  total_referrals: number;
  referral_code: string;
  comments: string;
  famous_products_tags: string[];
  offers: string[];
  slogan: string;
  website_url: string;
  store_time: StoreTime[];
  is_franchise_enabled: boolean;
  franchise_email: string;
  is_alarm_sound_activated: boolean;
  is_store_can_complete_order: boolean;
  is_store_can_add_provider: boolean;
  wallet_currency_code: string;
  wallet: number;
  is_visible: boolean;
  admin_profit_value_on_store: number;
  admin_profit_mode_on_store: number;
  provider_rate_count: number;
  provider_rate: number;
  user_rate_count: number;
  user_rate: number;
  delivery_time_max: number;
  delivery_time: number;
  free_delivery_within_radius: number;
  free_delivery_for_above_order_price: number;
  is_store_pay_delivery_fees: boolean;
  delivery_radius: number;
  is_provide_delivery_anywhere: boolean;
  is_provide_laundry_service: boolean;
  is_provide_pickup_delivery: boolean;
  is_ask_estimated_time_for_ready_order: boolean;
  accept_only_cashless_payment: boolean;
  is_document_uploaded: boolean;
  is_phone_number_verified: boolean;
  is_email_verified: boolean;
  is_approved: boolean;
  is_business: boolean;
  is_store_busy: boolean;
  price_rating: number;
  image_url: string;
  address: string;
  phone: string;
  email: string;
  name: string;
  company_name: string;
  country_details: CountryDetails;
  city_details: CityDetails;
  delivery_details: DeliveryDetails;
}

interface StoreTime {
  is_store_open: boolean;
  is_store_open_full_time: boolean;
  day: number;
  day_time: DayTime[];
}

interface DayTime {
  store_open_time: string;
  store_close_time: string;
}

interface CountryDetails {
  country_name: string;
}

interface CityDetails {
  city_name: string;
}

interface DeliveryDetails {
  delivery_name: string;
}

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.css']
})
export class StoreProfileComponent implements OnInit {
  storeDetail: StoreDetail | null = null;
  editMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storeId = localStorage.getItem('store_id');
  const serverToken = localStorage.getItem('server_token');
    const payload = {
      store_id: storeId,
      server_token: serverToken
    };

    this.http.post<any>('https://test.zmallapp.com/api/store/get_store_data', payload).subscribe(response => {
      if (response.success) {
        this.storeDetail = response.store_detail;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    // Implement save logic here, e.g., sending updated details to the server
    this.toggleEditMode();
  }
}
