import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare let $: any; // This line declares jQuery so TypeScript understands the $ symbol


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  LoggedIn$: Observable<boolean>;
  adminUrl = environment.adminUrl;
  newIncommingOrder: any = []
  private intervalId: any;
  showSidebar: boolean = true;

  constructor(private authService: AuthService, private http: HttpClient,private router: Router) {
    this.LoggedIn$ = this.authService.isLoggedIn();
  }


  printData() {
    window.print();
  }

  exportCSV() {
    // Implement your method to export data as CSV
  }

  ngOnInit(): void {
    if (this.router.url === '/login') {
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
    // if (typeof $ !== 'undefined') {
    //   // If jQuery is loaded, alert that jQuery is installed and show its version.
    //   alert(`jQuery is installed! Version: ${$.fn.jquery}`);
    // } else {
    //   // If jQuery is not loaded, alert that jQuery is not installed.
    //   alert('jQuery is not installed!');
    // }
  }


  title = 'zmallstore';

}
