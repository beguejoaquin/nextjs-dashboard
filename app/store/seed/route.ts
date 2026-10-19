import postgres from "postgres";
import bcrypt from "bcrypt";

import {
  storeUsers,
  products,
  variantNames,
  transactions,
  dailyRegistries,
  sales,
  saleItems,
} from "@/app/store/lib/place-holder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function createProductsTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price_in_cents INT NOT NULL,
      category VARCHAR(255) NOT NULL,
      owner_id UUID NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES store_users(id)
    );
  `;
}

async function createProductVariantsTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS product_variants (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      product_id UUID NOT NULL,
      stock INT NOT NULL,
      active bool NOT NULL,
      image_url VARCHAR(255),
      owner_id UUID NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (owner_id) REFERENCES store_users(id)
    );
  `;
}

async function createDailyRegistriesTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS daily_registries (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      initial_cash_in_cents INT NOT NULL,
      current_cash_in_cents INT NOT NULL,
      owner_id UUID NOT NULL,
      date DATE NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES store_users(id)
    );
  `;
}

async function createTransactionsTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      type VARCHAR(10) NOT NULL,
      amount_in_cents INT NOT NULL,
      description VARCHAR(255),
      payment_method VARCHAR(10) NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      registry_id UUID NOT NULL,
      owner_id UUID NOT NULL,
      FOREIGN KEY (registry_id) REFERENCES daily_registries(id),
      FOREIGN KEY (owner_id) REFERENCES store_users(id)
    );
  `;
}

async function createSalesTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS sales (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      transaction_id UUID NOT NULL,
      owner_id UUID NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id),
      FOREIGN KEY (owner_id) REFERENCES store_users(id)
    );
  `;
}

async function createSaleItemsTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS sale_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      sale_id UUID NOT NULL,
      product_variant_id UUID NOT NULL,
      quantity INT NOT NULL,
      unitary_price_in_cents INT NOT NULL,
      owner_id UUID NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_variant_id) REFERENCES product_variants(id),
      FOREIGN KEY (owner_id) REFERENCES store_users(id)
    );
  `;
}

async function createStoreUsersTable(db: typeof sql) {
  await db`--sql 
    CREATE TABLE IF NOT EXISTS store_users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      company_name VARCHAR(255) NOT NULL,
      password TEXT NOT NULL
    );
  `;
}

async function seedStoreUsers(db: typeof sql) {
  const insertedUsers = await Promise.all(
    storeUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return db`--sql
        INSERT INTO store_users (first_name, last_name, email, company_name, password)
        VALUES (${user.first_name}, ${user.last_name}, ${user.email}, ${user.company_name}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
  return insertedUsers;
}

async function seedProducts(db: typeof sql) {
  const insertedProducts = await Promise.all(
    products.map(async (product) => {
      return db`--sql
        INSERT INTO products (name, price_in_cents, category, owner_id)
        VALUES (${product.name}, ${product.price_in_cents}, ${product.category}, ${product.owner_id});
      `;
    }),
  );
  return insertedProducts;
}

async function seedProductVariants(db: typeof sql) {
  const products = await db`SELECT id, name FROM products;`;

  const productVariants = [
    ...products.flatMap((product, productIndex) =>
      variantNames[productIndex].map((name, variantIndex) => {
        return {
          name,
          product_id: product.id,
          stock: 10,
          active: true,
          owner_id: product.owner_id,
        };
      }),
    ),
  ];

  const insertedProducts = await Promise.all(
    products.map(async (product) => {
      return db`--sql
        INSERT INTO products (name, price_in_cents, category, owner_id)
        VALUES (${product.name}, ${product.price_in_cents}, ${product.category}, ${product.owner_id});
      `;
    }),
  );
  return insertedProducts;
}

export async function GET() {
  try {
    const result = await sql.begin(async (tx) => {
      await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

      return await seedProductVariants(tx);
    });

    const message = result ? result : "Database seeded successfully";

    return Response.json({ message: message });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
