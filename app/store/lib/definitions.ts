export type Product = {
  id: string;
  name: string;
  price_in_cents: number;
  category: string;
  owner: User;
};

export type ProductVariant = {
  id: string;
  name: string;
  product: Product;
  stock: number;
  active: boolean;
  image_url: string;
  owner: User;
};

export type DailyRegistry = {
  id: string;
  initial_cash_in_cents: number;
  current_cash_in_cents: number;
  date: string;
  owner: User;
};

export type Transaction = {
  id: string;
  type: "sale" | "payment" | "income" | "output" | "expense";
  amount_in_cents: number;
  description: string;
  payment_method: "cash" | "card";
  timestamp: string;
  registry: DailyRegistry;
  owner: User;
};

export type Sale = {
  id: string;
  transaction: Transaction;
  items: SaleItem[];
  owner: User;
};

export type SaleItem = {
  id: string;
  sale: Sale;
  product_variant: ProductVariant;
  quantity: number;
  unitary_price_in_cents: number;
  owner: User;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  password: string;
};
