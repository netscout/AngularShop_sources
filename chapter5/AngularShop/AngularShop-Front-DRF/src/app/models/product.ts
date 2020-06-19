import { Category } from './category';

export interface Product {
  id: number,
  name: string,
  description: string,
  makerId: number,
  makerName: string,
  tags: string,
  price: number,
  discount?: number,
  stockCount: number,
  isVisible: boolean,
  createdDate?: Date,
  modifiedDate?: Date,
  categoryIds: number[],
  categories: Category[],
  photoUrls: string[]
}
