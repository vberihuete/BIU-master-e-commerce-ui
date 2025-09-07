import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Espresso', price: 3.99, image: 'assets/placeholder.jpg' },
    { id: 2, name: 'Cappuccino', price: 4.49, image: 'assets/placeholder.jpg' },
    { id: 3, name: 'Croissant', price: 2.99, image: 'assets/placeholder.jpg' },
    { id: 4, name: 'Muffin', price: 3.49, image: 'assets/placeholder.jpg' }
  ];

  private cartSubject = new BehaviorSubject<Product[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, product]);
  }

  removeFromCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    const index = currentCart.findIndex(item => item.id === product.id);
    if (index > -1) {
      const newCart = [...currentCart];
      newCart.splice(index, 1);
      this.cartSubject.next(newCart);
    }
  }

  getCart(): Product[] {
    return this.cartSubject.value;
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.price, 0);
  }

  getCartCount(): number {
    return this.cartSubject.value.length;
  }
}
