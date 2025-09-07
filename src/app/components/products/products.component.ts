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
    this.products = this.productService.getProducts();
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
