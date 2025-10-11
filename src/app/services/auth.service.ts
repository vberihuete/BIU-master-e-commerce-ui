import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, UserRegistrationRequest, AuthState } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAuthState();
  }

  /**
   * Register a new user
   */
  register(userData: UserRegistrationRequest): Observable<any> {
    const registerData = {
      username: userData.email.split('@')[0], // Generate username from email
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber
    };

    return this.http.post(`${this.apiUrl}/auth/register`, registerData).pipe(
      tap(() => {
        // Optionally auto-login after registration
        console.log('Registration successful');
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.saveAuthState(response);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.authStateSubject.next({
      isAuthenticated: false,
      token: null,
      user: null
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.authStateSubject.value.token || localStorage.getItem('auth_token');
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'USER' | 'ADMIN'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Save authentication state to localStorage
   */
  private saveAuthState(loginResponse: LoginResponse): void {
    const user: User = {
      username: loginResponse.username,
      email: loginResponse.email,
      role: loginResponse.role,
      firstName: '',
      lastName: '',
      phoneNumber: ''
    };

    localStorage.setItem('auth_token', loginResponse.token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    this.authStateSubject.next({
      isAuthenticated: true,
      token: loginResponse.token,
      user: user
    });
  }

  /**
   * Load authentication state from localStorage
   */
  private loadAuthState(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.authStateSubject.next({
          isAuthenticated: true,
          token: token,
          user: user
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  /**
   * Refresh token (if needed in the future)
   */
  refreshToken(): Observable<any> {
    // Implement if backend supports token refresh
    return throwError(() => new Error('Token refresh not implemented'));
  }
}

