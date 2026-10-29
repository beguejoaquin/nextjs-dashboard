const ownerId = "410544b2-4001-4271-9855-fec4b6a6442a";

export const users = [
  {
    id: ownerId,
    first_name: "Alex",
    last_name: "Morgan",
    email: "alex.morgan@cornerstore.com",
    company_name: "Morgan Corner Store",
    password: "Store123!",
  },
];

const productsData = Array.from({ length: 10 }, (_, index) => ({
  id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  name: [
    "Classic T-Shirt",
    "Running Shoes",
    "Coffee Mug",
    "Backpack",
    "Wireless Mouse",
    "Desk Lamp",
    "Water Bottle",
    "Notebook",
    "Baseball Cap",
    "Bluetooth Speaker",
  ][index],
  price_in_cents: [2499, 8999, 1299, 5999, 3499, 4599, 1999, 799, 1599, 6999][
    index
  ],
  category: [
    "Clothing",
    "Footwear",
    "Kitchen",
    "Accessories",
    "Electronics",
    "Home",
    "Drinkware",
    "Stationery",
    "Accessories",
    "Electronics",
  ][index],
  owner_id: ownerId,
}));

const productVariantsData = productsData.flatMap((product, productIndex) =>
  ["Small", "Medium", "Large", "Extra Large"].map(
    (variantName, variantIndex) => ({
      id: `20000000-${String(productIndex + 1).padStart(4, "0")}-4000-${String(variantIndex + 1).padStart(4, "0")}-000000000000`,
      name: `${product.name} - ${variantName}`,
      product_id: product.id,
      stock: 20 + productIndex * 4 + variantIndex,
      active: variantIndex !== 3 || productIndex % 3 !== 0,
      image_url: `/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${variantIndex + 1}.jpg`,
      owner_id: ownerId,
    }),
  ),
);

const dailyRegistriesData = Array.from({ length: 10 }, (_, index) => ({
  id: `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  initial_cash_in_cents: 100000 + index * 5000,
  current_cash_in_cents:
    100000 +
    index * 5000 +
    [1250, 3600, 980, 4200, 2750, 5100, 1800, 6400, 3900, 7200][index],
  owner_id: ownerId,
  date: `2026-10-${String(index + 1).padStart(2, "0")}`,
}));

const transactionsData = dailyRegistriesData.map((registry, index) => ({
  id: `40000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  type: index % 2 === 0 ? "sale" : "income",
  amount_in_cents: [1250, 3600, 980, 4200, 2750, 5100, 1800, 6400, 3900, 7200][
    index
  ],
  description: `Transaction ${index + 1}`,
  payment_method: index % 3 === 0 ? "cash" : "card",
  timestamp: `2026-10-${String(index + 1).padStart(2, "0")}T${String(9 + index).padStart(2, "0")}:30:00Z`,
  registry_id: registry.id,
  owner_id: ownerId,
}));

const salesData = transactionsData.map((transaction, index) => ({
  id: `50000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  transaction_id: transaction.id,
  owner_id: ownerId,
}));

const saleItemsData = salesData.map((sale, index) => ({
  id: `60000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  sale_id: sale.id,
  product_variant_id: productVariantsData[index * 4].id,
  quantity: (index % 3) + 1,
  unitary_price_in_cents: productsData[index].price_in_cents,
  owner_id: ownerId,
}));

const createProducts = (userId = ownerId) =>
  productsData.map((product) => ({ ...product, owner_id: userId }));

const createProductVariants = (products = productsData, userId = ownerId) =>
  productVariantsData.map((variant, index) => ({
    ...variant,
    product_id: products[Math.floor(index / 4)]?.id ?? variant.product_id,
    owner_id: userId,
  }));

const createDailyRegistries = (userId = ownerId) =>
  dailyRegistriesData.map((registry) => ({ ...registry, owner_id: userId }));

const createTransactions = (
  registries = dailyRegistriesData,
  userId = ownerId,
) =>
  transactionsData.map((transaction, index) => ({
    ...transaction,
    registry_id: registries[index]?.id ?? transaction.registry_id,
    owner_id: userId,
  }));

const createSales = (transactions = transactionsData, userId = ownerId) =>
  salesData.map((sale, index) => ({
    ...sale,
    transaction_id: transactions[index]?.id ?? sale.transaction_id,
    owner_id: userId,
  }));

const createSaleItems = (
  sales = salesData,
  variants = productVariantsData,
  userId = ownerId,
) =>
  saleItemsData.map((item, index) => ({
    ...item,
    sale_id: sales[index]?.id ?? item.sale_id,
    product_variant_id: variants[index * 4]?.id ?? item.product_variant_id,
    owner_id: userId,
  }));

export const products = createProducts();
export const productVariants = createProductVariants();
export const dailyRegistries = createDailyRegistries();
export const transactions = createTransactions();
export const sales = createSales();
export const saleItems = createSaleItems();
