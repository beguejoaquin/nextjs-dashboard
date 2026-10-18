import Cart from "@/app/store/ui/cart";
import Search from "@/app/store/ui/search";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <Search placeholder="Search products by name or code" />
      <div
        id="carts"
        className="flex flex-1 justify-evenly items-center p-3 min-h-0 overflow-auto"
      >
        <Cart number={1} />
        <Cart number={2} />
        <Cart number={3} />
      </div>
    </div>
  );
}
