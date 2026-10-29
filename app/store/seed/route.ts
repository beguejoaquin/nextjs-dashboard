import postgres from "postgres";
import bcrypt from "bcrypt";

import {
  users,
  products,
  productVariants,
  dailyRegistries,
  transactions,
  sales,
  saleItems,
} from "@/app/store/lib/place-holder-data";
import { Datatype } from "next/font/google";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const dataTables = [
  {
    table: "users",
    data: users,
  },
  {
    table: "products",
    data: products,
  },
  {
    table: "product_variants",
    data: productVariants,
  },
  {
    table: "daily_registries",
    data: dailyRegistries,
  },
  {
    table: "transactions",
    data: transactions,
  },
  {
    table: "sales",
    data: sales,
  },
  {
    table: "sale_items",
    data: saleItems,
  },
];

async function insertData(
  db: typeof sql,
  table: string,
  data: object[],
  reseed: boolean = false,
) {
  // If no reseed, return if the table is already seeded
  let rows = await db`SELECT COUNT(*) FROM ${db(table)}`;
  if (reseed == false && rows) return `Table ${table} already seeded.`;

  // Insert data
  try {
    data.forEach(async (row) => {
      await db`INSERT INTO ${db(table)} ${db(row)}`;
    });
    return `Table ${table} seeded successfully`;
  } catch (error) {
    return `Error seeding ${table}: ${error}`;
  }
}

export async function GET() {
  try {
    const result = await sql.begin(async (tx) => {
      await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

      return dataTables.forEach(async (dataTable) => {
        return await insertData(tx, dataTable.table, dataTable.data);
      });

      return;
    });

    return Response.json({
      data: result,
      message: "Database seeded successfully",
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
