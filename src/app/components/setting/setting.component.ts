import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  storeDetail: any = {};
  showClockFlag: boolean[] = [false, false, false, false, false, false, false];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getStoreDetails();
  }

  getStoreDetails() {
    const payload = {
      store_id: '6422d06d8b4ace2d10b9aff9',
      server_token: 'tOkQeWKznvQyZySVu2TFwE3OsKQRWJhD'
    };

    this.http.post('https://test.zmallapp.com/api/store/get_store_data', payload).subscribe((response: any) => {
      if (response.success) {
        this.storeDetail = response.store_detail;
        console.log(this.storeDetail); // Check the console to verify data
      }
    });
  }

  showTimePicker(dayIndex: number) {
    this.showClockFlag[dayIndex] = true;
  }

  hideTimePicker(dayIndex: number) {
    this.showClockFlag[dayIndex] = false;
  }

  updateSetting(formValue: any) {
    // Add logic to handle form submission
    console.log('Form Value:', formValue);
  }

  resetForm() {
    // Add logic to reset the form
    this.getStoreDetails();
  }
}
