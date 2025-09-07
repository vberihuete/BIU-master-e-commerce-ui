import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from './services/product.service';
import { Observable } from 'rxjs';

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

  constructor(private productService: ProductService) {
    this.cartCount$ = new Observable(observer => {
      this.productService.cart$.subscribe(cart => {
        observer.next(cart.length);
      });
    });
  }
}
