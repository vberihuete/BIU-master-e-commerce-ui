import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, AlertMessage } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  alerts: AlertMessage[] = [];
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Form Field Getters
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  // Form Submission
  onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.isLoading = true;

      const loginData: LoginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSubmitting = false;
          
          this.addAlert('success', `Welcome back, ${response.username}!`);
          
          // Redirect based on role
          setTimeout(() => {
            if (response.role === 'ADMIN') {
              this.router.navigate(['/products']);
            } else {
              this.router.navigate(['/home']);
            }
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.isSubmitting = false;
          
          let message = 'Login failed. Please check your credentials.';
          if (error.status === 401) {
            message = 'Invalid username or password.';
          } else if (error.status === 403) {
            message = 'Your account has been disabled.';
          } else if (error.error?.message) {
            message = error.error.message;
          }
          
          this.addAlert('error', message);
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
      this.addAlert('warning', 'Please fill in all required fields.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Alert Management
  addAlert(type: AlertMessage['type'], message: string): void {
    const alert: AlertMessage = {
      type,
      message,
      timestamp: new Date()
    };
    this.alerts.push(alert);

    // Auto-remove success and info alerts after 5 seconds
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        this.removeAlert(alert);
      }, 5000);
    }
  }

  removeAlert(alert: AlertMessage): void {
    const index = this.alerts.indexOf(alert);
    if (index > -1) {
      this.alerts.splice(index, 1);
    }
  }

  // Utility Methods
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    if (errors['minlength']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters long.`;
    }

    return 'Please enter a valid value.';
  }
}