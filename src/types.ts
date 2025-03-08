import { JSX } from 'react';

export interface StoreItem {
  id: number;
  storeID: string; 
  store: string;
  city: string;
  state: string;
}

export interface SKUItem {
  id: number;
  skuCode: string;
  label: string;
  class: string;
  department: string;
  price: number;
  cost: number;
}

export interface CalendarItem {
  id: number;
  week: string;
  weekLabel: string;
  month: string;
  monthLabel: string;
}

export interface PlanningItem {
  id: number;
  storeID: string;
  storeName: string;
  skuCode: string;
  skuLabel: string;
  week: string;
  weekLabel: string;
  month: string;
  monthLabel: string;
  salesUnits: number;
  price: number;
  cost: number;
}

// For AG-Grid data representation
export interface PlanningRowData {
  id: string; // Composite key: storeID-skuCode
  storeID: string;
  storeName: string;
  skuCode: string;
  skuLabel: string;
  price: number;
  cost: number;
  [key: string]: number | string; 
}

// Generic Column type for DataTable
export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  width?: string;
  borderRight?: boolean;
  render?: (value: T[keyof T]) => string | JSX.Element;
}

// Generic DataTableProps type
export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  setData: (data: T[]) => void;
  enableDrag?: boolean;
  enableDelete?: boolean;
  newItemLabel: string;
  initialNewItem: T;
  validateNewItem: (item: T) => boolean;
  formatValue?: (value: T[keyof T], accessor: keyof T | string) => string | JSX.Element;
}