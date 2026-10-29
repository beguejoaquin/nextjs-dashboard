import postgres from "postgres";
import {
  createTransactions,
  dailyRegistriesData,
} from "@/app/store/lib/place-holder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  let rows = await sql`SELECT id FROM store_users;`;
  const userId = rows[0].id;
  const data = createTransactions(dailyRegistriesData, userId);

  return Response.json({ data });
}
