import { z } from "zod";

export type Product = {
  id: string;
  name: string;
  price_in_cents: number;
  category: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  product_id: string;
  stock: number;
  active: boolean;
  image_url: string;
};

export type DailyRegistry = {
  id: string;
  initial_cash_in_cents: number;
  current_cash_in_cents: number;
  date: string;
};

export type Transaction = {
  id: string;
  type: "sale" | "payment" | "income" | "output" | "expense";
  amount_in_cents: number;
  description: string;
  payment_method: "cash" | "card";
  timestamp: string;
  registry_id: string;
};

export type Sale = {
  id: string;
  transaction_id: string;
};

export type SaleItem = {
  id: string;
  sale_id: string;
  product_variant_id: string;
  quantity: number;
  unitary_price_in_cents: number;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  password: string;
};
