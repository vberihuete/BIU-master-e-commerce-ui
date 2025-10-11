import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ProductService } from './services/product.service';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cafeteria Lulu';
  cartCount$: Observable<number>;
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartCount$ = new Observable(observer => {
      this.productService.cart$.subscribe(cart => {
        observer.next(cart.length);
      });
    });

    this.isAuthenticated$ = this.authService.authState$.pipe(
      map(state => state.isAuthenticated)
    );

    this.isAdmin$ = this.authService.authState$.pipe(
      map(state => state.isAuthenticated && state.user?.role === 'ADMIN')
    );

    this.currentUser$ = this.authService.authState$.pipe(
      map(state => state.user)
    );
  }

  logout(): void {
    this.authService.logout();
    this.productService.clearCart();
    this.router.navigate(['/home']);
  }
}
