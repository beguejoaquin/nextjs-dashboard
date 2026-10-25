import postgres from "postgres";
import bcrypt from "bcrypt";

import {
  storeUsers,
  products,
  variantNames,
  transactions,
  dailyRegistries,
} from "@/app/store/lib/place-holder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getStoreUser(db: typeof sql) {
  const user = await db`SELECT * FROM store_users LIMIT 1;`;
  return user[0];
}

async function seedStoreUsers(db: typeof sql) {
  const insertedUsers = await Promise.all(
    storeUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return db`--sql
        INSERT INTO store_users (first_name, last_name, email, company_name, password)
        VALUES (${user.first_name}, ${user.last_name}, ${user.email}, ${user.company_name}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    }),
  );
  return insertedUsers;
}

async function seedProducts(db: typeof sql) {
  const user = await getStoreUser(db);

  if (!user) return "User not found";

  const insertedProducts = await Promise.all(
    products.map(async (product) => {
      return db`--sql
        INSERT INTO products (name, price_in_cents, category, owner_id)
        VALUES (${product.name}, ${product.price_in_cents}, ${product.category}, ${user.id});
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

      return await seedStoreUsers(tx);
    });

    const message = result ? result : "Database seeded successfully";

    return Response.json({ message: message });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
