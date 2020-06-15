export interface Category {
  id: number;
  name: string;
  parentId?: number;
  totalProducts: number;
  children: Category[];
}

export interface CategoryListItem {
  id: number;
  name: string;
  totalProducts: number;
}
