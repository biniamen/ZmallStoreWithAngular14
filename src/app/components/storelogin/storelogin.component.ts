import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-storelogin',
  templateUrl: './storelogin.component.html',
  styleUrls: ['./storelogin.component.css']
})
export class StoreloginComponent implements OnInit {
  loginForm: FormGroup;

  userCredentials = {
    email: '',
    password: ''
  };

  constructor(private fb: FormBuilder,
    private http: HttpClient, private authService: AuthService,private router: Router, private toastr: ToastrService) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      });
    }

    onSubmit(): void {
      if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        this.authService.login(email, password).subscribe({
          next: (response) => {
            console.log(response);
            this.toastr.success('Success!', 'Logged In!');
            this.router.navigate(['/orderhistory']);
            this.loginForm.reset(); // Reset the form after successful login
          },
          error: (error) => {
            console.error(error);
            this.toastr.error('Login failed.', 'Error!');
            this.loginForm.reset(); // Reset the form if login failed
          }
        });
      }
    }
  // starting
    ngOnInit(): void {
      if (!this.authService.isLoggedInSync()) {
        this.router.navigate(['/login']); // Redirect to login if not logged in
      }
    }



}
