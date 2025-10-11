// Backend User Model
export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: 'USER' | 'ADMIN';
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Registration Request (Frontend -> Backend)
export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  salary?: number;
  occupation?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  newsletterSubscription?: boolean;
  termsAccepted?: boolean;
}

// Login Request
export interface LoginRequest {
  username: string;
  password: string;
}

// Login Response
export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Alert Message
export interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}
