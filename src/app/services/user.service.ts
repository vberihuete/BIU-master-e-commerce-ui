import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { User, UserRegistrationRequest, AlertMessage } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private users: User[] = [];
  private nextId = 1;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Initialize with some mock data for testing
    this.users = [
      {
        id: 1,
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        phoneNumber: '+1234567890',
        role: 'USER' as const,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  registerUser(userData: UserRegistrationRequest): Observable<{ success: boolean; message: string; user?: User }> {
    // Use the auth service to register the user with the backend
    return this.authService.register(userData).pipe(
      map(() => ({
        success: true,
        message: 'Registration successful! Welcome to our platform. You can now log in.',
        user: undefined
      })),
      catchError((error) => {
        let message = 'Registration failed. Please try again.';
        
        if (error.error?.message) {
          message = error.error.message;
        } else if (error.status === 409) {
          message = 'Email address is already registered. Please use a different email.';
        } else if (error.status === 400) {
          message = 'Invalid registration data. Please check your inputs.';
        }

        return of({
          success: false,
          message: message,
          user: undefined
        });
      })
    );
  }

  checkEmailAvailability(email: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const exists = this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
        observer.next(!exists);
        observer.complete();
      }, 500);
    });
  }

  getAllUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user).pipe(delay(500));
  }

  // Helper method to create alert messages
  createAlert(type: AlertMessage['type'], message: string): AlertMessage {
    return {
      type,
      message,
      timestamp: new Date()
    };
  }
}
