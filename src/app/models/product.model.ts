export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity?: number;
  category?: string;
  imageUrl?: string;
  image?: string;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
