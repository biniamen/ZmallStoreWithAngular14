// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedInSync());
  adminUrl = environment.adminUrl;


  constructor(private http: HttpClient,private router: Router) {}

  // Call this method after successful login
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.adminUrl+'/store/login', { email, password }).pipe(
      tap((response: any) => {
        if (response && response.store && response.store.server_token) {
          // Assuming server_token and _id are the properties you want to store
          localStorage.setItem('server_token', response.store.server_token);
          localStorage.setItem('store_id', response.store._id);
          // Serialize the store object into a string before storing it
          localStorage.setItem('store_info', JSON.stringify(response.store));
         this.loggedIn.next(true);

        }
      })
    );
  }


  // Call this method on logout
  logout(): void {
    localStorage.removeItem('server_token');
    localStorage.removeItem('store_id');
    localStorage.removeItem('store_info');
    localStorage.removeItem('cart');
    this.loggedIn.next(false);
    this.router.navigate(['/login']); // Assuming '/login' is your login route
  }

  // Use this method to protect routes or hide/show UI elements
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
// Helper method to check login status synchronously
isLoggedInSync(): boolean {
  // You could also check for other criteria to ensure token validity
  return !!localStorage.getItem('server_token');
}

}
