import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { UserRegistrationRequest, AlertMessage } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  alerts: AlertMessage[] = [];
  isLoading = false;
  isSubmitting = false;

  // Password strength levels
  passwordStrength = {
    score: 0,
    feedback: ''
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupPasswordStrengthValidation();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email], [this.emailAvailabilityValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      
      // Personal Details
      dateOfBirth: ['', [Validators.required, this.ageValidator.bind(this)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      gender: ['', [Validators.required]],
      
      // Address Information
      address: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
        country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
      }),
      
      // Professional Information
      occupation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      salary: [null, [Validators.min(0), Validators.max(1000000)]],
      
      // Preferences
      newsletterSubscription: [false],
      termsAccepted: [false, [Validators.requiredTrue]]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  private setupPasswordStrengthValidation(): void {
    this.registrationForm.get('password')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(password => {
      this.calculatePasswordStrength(password);
    });
  }

  // Custom Validators
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, hasMinLength].filter(Boolean).length;
    
    if (score < 3) {
      return { weakPassword: true };
    }
    return null;
  }

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    const dateOfBirth = control.value;
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      return { tooYoung: { requiredAge: 13, actualAge: age } };
    }
    
    if (age > 120) {
      return { tooOld: { maxAge: 120, actualAge: age } };
    }

    return null;
  }

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private emailAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return this.userService.checkEmailAvailability(control.value).pipe(
        debounceTime(500),
        map(isAvailable => isAvailable ? null : { emailTaken: true }),
        catchError(() => of(null))
      );
    };
  }

  private calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = { score: 0, feedback: '' };
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const hasGoodLength = password.length >= 12;

    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, hasMinLength, hasGoodLength].filter(Boolean).length;
    
    let feedback = '';
    if (score < 3) {
      feedback = 'Weak password';
    } else if (score < 5) {
      feedback = 'Medium strength password';
    } else {
      feedback = 'Strong password';
    }

    this.passwordStrength = { score, feedback };
  }

  // Form Field Getters
  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get dateOfBirth() { return this.registrationForm.get('dateOfBirth'); }
  get phoneNumber() { return this.registrationForm.get('phoneNumber'); }
  get gender() { return this.registrationForm.get('gender'); }
  get occupation() { return this.registrationForm.get('occupation'); }
  get salary() { return this.registrationForm.get('salary'); }
  get termsAccepted() { return this.registrationForm.get('termsAccepted'); }
  get address() { return this.registrationForm.get('address'); }

  // Address field getters
  get street() { return this.address?.get('street') || null; }
  get city() { return this.address?.get('city') || null; }
  get state() { return this.address?.get('state') || null; }
  get zipCode() { return this.address?.get('zipCode') || null; }
  get country() { return this.address?.get('country') || null; }

  // Form Submission
  onSubmit(): void {
    if (this.registrationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.isLoading = true;

      const formData = this.registrationForm.value;
      const registrationData: UserRegistrationRequest = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth)
      };

      this.userService.registerUser(registrationData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSubmitting = false;
          
          if (response.success) {
            this.addAlert('success', response.message);
            this.registrationForm.reset();
            this.passwordStrength = { score: 0, feedback: '' };
          } else {
            this.addAlert('error', response.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.isSubmitting = false;
          this.addAlert('error', 'An unexpected error occurred. Please try again.');
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
      this.addAlert('warning', 'Please fill in all required fields correctly.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
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
  getFieldError(field: AbstractControl | null, fieldName: string): string {
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return `${fieldName} is required.`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address.';
    }
    if (errors['emailTaken']) {
      return 'This email address is already registered.';
    }
    if (errors['minlength']) {
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters long.`;
    }
    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['pattern']) {
      return `Please enter a valid ${fieldName.toLowerCase()}.`;
    }
    if (errors['weakPassword']) {
      return 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.';
    }
    if (errors['tooYoung']) {
      return `You must be at least ${errors['tooYoung'].requiredAge} years old to register.`;
    }
    if (errors['tooOld']) {
      return `Please enter a valid date of birth.`;
    }
    if (errors['passwordMismatch']) {
      return 'Passwords do not match.';
    }
    if (errors['min']) {
      return `Value must be at least ${errors['min'].min}.`;
    }
    if (errors['max']) {
      return `Value cannot exceed ${errors['max'].max}.`;
    }

    return 'Please enter a valid value.';
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength.score < 3) return '#dc3545'; // Red
    if (this.passwordStrength.score < 5) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  }

  getPasswordStrengthWidth(): string {
    return `${(this.passwordStrength.score / 6) * 100}%`;
  }
}