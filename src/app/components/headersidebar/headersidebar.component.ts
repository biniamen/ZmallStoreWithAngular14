import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-headersidebar',
  templateUrl: './headersidebar.component.html',
  styleUrls: ['./headersidebar.component.css']
})
export class HeadersidebarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.authService.logout();
  }
}
