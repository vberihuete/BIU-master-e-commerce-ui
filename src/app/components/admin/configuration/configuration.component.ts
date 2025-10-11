import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { AlertMessage } from '../../../models/user.model';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  alerts: AlertMessage[] = [];
  isLoading = false;
  isSubmitting = false;
  editingProduct: Product | null = null;
  showProductForm = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProducts();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0.01), Validators.max(999999)]],
      stockQuantity: [0, [Validators.required, Validators.min(0), Validators.max(999999)]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      imageUrl: ['', [Validators.maxLength(500)]],
      available: [true]
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.addAlert('error', 'Failed to load products. Please try again.');
        this.isLoading = false;
      }
    });
  }

  showAddProductForm(): void {
    this.editingProduct = null;
    this.productForm.reset({ available: true, stockQuantity: 0 });
    this.showProductForm = true;
  }

  showEditProductForm(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity || 0,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      available: product.available !== false
    });
    this.showProductForm = true;
  }

  cancelForm(): void {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const productData = this.productForm.value;

      if (this.editingProduct && this.editingProduct.id) {
        // Update existing product
        this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
          next: (updatedProduct) => {
            this.isSubmitting = false;
            this.addAlert('success', `Product "${updatedProduct.name}" updated successfully!`);
            this.loadProducts();
            this.cancelForm();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating product:', error);
            this.addAlert('error', 'Failed to update product. Please try again.');
          }
        });
      } else {
        // Create new product
        this.productService.createProduct(productData).subscribe({
          next: (newProduct) => {
            this.isSubmitting = false;
            this.addAlert('success', `Product "${newProduct.name}" created successfully!`);
            this.loadProducts();
            this.cancelForm();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error creating product:', error);
            this.addAlert('error', 'Failed to create product. Please try again.');
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      this.addAlert('warning', 'Please fill in all required fields correctly.');
    }
  }

  deleteProduct(product: Product): void {
    if (!product.id) return;
    
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.addAlert('success', `Product "${product.name}" deleted successfully!`);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.addAlert('error', 'Failed to delete product. Please try again.');
        }
      });
    }
  }

  updateStock(product: Product): void {
    if (!product.id) return;
    
    const newQuantity = prompt(`Enter new stock quantity for "${product.name}":`, 
                               (product.stockQuantity || 0).toString());
    
    if (newQuantity !== null && !isNaN(Number(newQuantity))) {
      this.productService.updateStock(product.id, Number(newQuantity)).subscribe({
        next: (updatedProduct) => {
          this.addAlert('success', `Stock updated for "${updatedProduct.name}"!`);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error updating stock:', error);
          this.addAlert('error', 'Failed to update stock. Please try again.');
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  // Form Field Getters
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stockQuantity() { return this.productForm.get('stockQuantity'); }
  get category() { return this.productForm.get('category'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }
  get available() { return this.productForm.get('available'); }

  // Alert Management
  addAlert(type: AlertMessage['type'], message: string): void {
    const alert: AlertMessage = {
      type,
      message,
      timestamp: new Date()
    };
    this.alerts.push(alert);

    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        this.removeAlert(alert);
      }, 5000);
    }
  }

  removeAlert(alert: AlertMessage): void {
    const index = this.alerts.indexOf(alert);
    if (index > -1) {
      this.alerts.splice(index, 1);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    if (errors['minlength']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['min']) {
      return `Value must be at least ${errors['min'].min}.`;
    }
    if (errors['max']) {
      return `Value cannot exceed ${errors['max'].max}.`;
    }

    return 'Please enter a valid value.';
  }
}
