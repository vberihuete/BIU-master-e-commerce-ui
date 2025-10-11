import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  cart$: Observable<Product[]>;
  cartCount$: Observable<number>;

  constructor(private productService: ProductService) {
    this.cart$ = this.productService.cart$;
    this.cartCount$ = new Observable(observer => {
      this.productService.cart$.subscribe(cart => {
        observer.next(cart.length);
      });
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAvailableProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Fallback to mock data if backend is not available
        this.products = [
          { id: 1, name: 'Espresso', price: 3.99, imageUrl: 'assets/placeholder.jpg', available: true },
          { id: 2, name: 'Cappuccino', price: 4.49, imageUrl: 'assets/placeholder.jpg', available: true },
          { id: 3, name: 'Croissant', price: 2.99, imageUrl: 'assets/placeholder.jpg', available: true },
          { id: 4, name: 'Muffin', price: 3.49, imageUrl: 'assets/placeholder.jpg', available: true }
        ];
      }
    });
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }

  removeFromCart(product: Product): void {
    this.productService.removeFromCart(product);
  }

  getTotal(): number {
    return this.productService.getTotal();
  }
}
