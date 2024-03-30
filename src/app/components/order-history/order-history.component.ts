import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // Add more elements...
];
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})


export class OrderHistoryComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'user', 'deliveryman', 'date', 'total', 'status','action'];
  public dataSource = new MatTableDataSource<any>(); // Use 'any' if you don't want a specific interface
  selectedRow: any = null; // Property to hold selected row data
  currency_sign: any

  adminUrl = environment.adminUrl;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  responseData: any;
  constructor(private http: HttpClient,private router: Router) {
    // Set up the filter predicate
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Transform the data object into a lowercase string of all property values.
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        // Use the JSON.stringify method to support nested objects
        return currentTerm + (data[key] && typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]) + '◬';
      }, '').toLowerCase();

      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) !== -1;
    };
   }

  ngOnInit(): void {
    this.getHistory()

  }


  getHistory() {
    // const storeId1 = localStorage.getItem('store_id');
    // const storeId = storeId1 ? JSON.parse(storeId1) : null;
    // const serverToken1 = localStorage.getItem('server_token');
    // const serverToken = serverToken1 ? JSON.parse(serverToken1) : null;
    const storeId = localStorage.getItem('store_id');
  const serverToken = localStorage.getItem('server_token');
    const payload = {
      store_id: storeId,
      server_token: serverToken,
      start_date: "",
      end_date: "",
      payment_status: "all",
      created_by: "both",
      pickup_type: "both",
      order_type: "both",
      order_status_id: "",
      search_field: "user_detail.first_name",
      search_value: "",
      page: 1
    };
    this.http.post(this.adminUrl + '/store/history', payload).subscribe(response => {
      this.responseData = response;
      this.dataSource.data = this.responseData.orders;
      this.selectFirstRow();
      const storeInfoString = localStorage.getItem('store_info');
      this.currency_sign = this.responseData.currency_sign;

      //this.currency_sign = this.responseData.currency_sign
      //this.responseData = Object.values(this.responseData)
      console.log(this.responseData);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }

  printData() {
    window.print();
  }

  exportCSV() {
    // Implement your method to export data as CSV
  }
  viewDetail(row: any): void {
    this.selectedRow = row; // Store the selected row data
  }

  onRowClicked(row: any) {
    this.selectedRow = row;
    console.log(this.selectedRow);
  }
  selectFirstRow(): void {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
      this.selectedRow = this.dataSource.data[0];
      // Call any additional methods to display details of the first row if necessary.
      this.onRowClicked(this.selectedRow);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  


}
