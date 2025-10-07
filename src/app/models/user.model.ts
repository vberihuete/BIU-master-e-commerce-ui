export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  salary?: number;
  occupation: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  newsletterSubscription: boolean;
  termsAccepted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  salary?: number;
  occupation: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  newsletterSubscription: boolean;
  termsAccepted: boolean;
}

export interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}
