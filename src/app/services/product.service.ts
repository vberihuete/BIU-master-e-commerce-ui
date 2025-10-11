import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  
  private cartSubject = new BehaviorSubject<Product[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  /**
   * Get available products
   */
  getAvailableProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/available`).pipe(
      catchError(error => {
        console.error('Error fetching available products:', error);
        throw error;
      })
    );
  }

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        throw error;
      })
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      catchError(error => {
        console.error('Error fetching products by category:', error);
        throw error;
      })
    );
  }

  /**
   * Search products
   */
  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error('Error searching products:', error);
        throw error;
      })
    );
  }

  /**
   * Create product (Admin only)
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        throw error;
      })
    );
  }

  /**
   * Update product (Admin only)
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }

  /**
   * Delete product (Admin only)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        throw error;
      })
    );
  }

  /**
   * Update stock (Admin only)
   */
  updateStock(id: number, quantity: number): Observable<Product> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.patch<Product>(`${this.apiUrl}/${id}/stock`, null, { params }).pipe(
      catchError(error => {
        console.error('Error updating stock:', error);
        throw error;
      })
    );
  }

  // Cart Management (Client-side)
  
  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, product]);
    this.saveCartToStorage();
  }

  removeFromCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    const index = currentCart.findIndex(item => item.id === product.id);
    if (index > -1) {
      const newCart = [...currentCart];
      newCart.splice(index, 1);
      this.cartSubject.next(newCart);
      this.saveCartToStorage();
    }
  }

  getCart(): Product[] {
    return this.cartSubject.value;
  }

  getTotal(): number {
    const total = this.cartSubject.value.reduce((total, item) => total + item.price, 0);
    return Math.round(total * 100) / 100; // Round to 2 decimal places
  }

  getCartCount(): number {
    return this.cartSubject.value.length;
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  private loadCartFromStorage(): void {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      try {
        const cart = JSON.parse(cartJson) as Product[];
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }
}
