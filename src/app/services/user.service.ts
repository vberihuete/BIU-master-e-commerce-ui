import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRegistrationRequest, AlertMessage } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with some mock data for testing
    this.users = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        confirmPassword: 'hashedpassword',
        dateOfBirth: new Date('1990-01-15'),
        phoneNumber: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        salary: 75000,
        occupation: 'Software Developer',
        gender: 'male',
        newsletterSubscription: true,
        termsAccepted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  registerUser(userData: UserRegistrationRequest): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        // Check if email already exists
        const existingUser = this.users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
        
        if (existingUser) {
          observer.next({
            success: false,
            message: 'Email address is already registered. Please use a different email.'
          });
          observer.complete();
          return;
        }

        // Validate password match
        if (userData.password !== userData.confirmPassword) {
          observer.next({
            success: false,
            message: 'Passwords do not match. Please try again.'
          });
          observer.complete();
          return;
        }

        // Validate age (must be at least 13 years old)
        const today = new Date();
        const birthDate = new Date(userData.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 13) {
          observer.next({
            success: false,
            message: 'You must be at least 13 years old to register.'
          });
          observer.complete();
          return;
        }

        // Create new user
        const newUser: User = {
          id: this.nextId++,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Remove confirmPassword before storing
        const { confirmPassword, ...userToStore } = newUser;
        const userToStoreWithPassword = { ...userToStore, confirmPassword: '' };
        
        this.users.push(userToStoreWithPassword as User);

        observer.next({
          success: true,
          message: 'Registration successful! Welcome to our platform.',
          user: userToStoreWithPassword as User
        });
        observer.complete();
      }, 1500); // Simulate network delay
    });
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
