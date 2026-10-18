import bcrypt from "bcrypt";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedProducts(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`--sql 
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price_in_cents INT NOT NULL,
      category VARCHAR(255) NOT NULL
    );
  `;
}

async function seedProductVariants(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`--sql 
    CREATE TABLE IF NOT EXISTS product_variants (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      product_id UUID NOT NULL,
      stock INT NOT NULL,
      active bool NOT NULL,
      image_url VARCHAR(255),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
}

async function seedDailyRegistries(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`--sql 
    CREATE TABLE IF NOT EXISTS daily_registries (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      initial_cash_in_cents INT NOT NULL,
      current_cash_in_cents INT NOT NULL,
      date DATE NOT NULL
    );
  `;
}

async function seedTransactions(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`--sql 
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      type VARCHAR(10) NOT NULL,
      amount_in_cents INT NOT NULL,
      description VARCHAR(255),
      payment_method VARCHAR(10) NOT NULL,
      timestamp DATE NOT NULL,
      registry_id UUID NOT NULL,
      FOREIGN KEY (registry_id) REFERENCES daily_registries(id)
    );
  `;
}

async function seedSales(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`--sql 
    CREATE TABLE IF NOT EXISTS sales (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      transaction_id UUID NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    );
  `;
}

async function seedSaleItems(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`--sql 
    CREATE TABLE IF NOT EXISTS sale_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      sale_id UUID NOT NULL,
      product_variant_id UUID NOT NULL,
      quantity INT NOT NULL,
      unitary_price_in_cents INT NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
    );
  `;
}

async function seedStoreUsers(db: typeof sql) {
  await db`--sql CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
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

export async function GET() {
  try {
    const result = await sql.begin(async (tx) => {
      await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

      await seedProducts(tx);
      await seedProductVariants(tx);
      await seedDailyRegistries(tx);
      await seedTransactions(tx);
      await seedSales(tx);
      await seedSaleItems(tx);
      await seedStoreUsers(tx);
    });

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
