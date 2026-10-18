import Link from "next/link";

import { Button } from "@/app/store/ui/sidebar-button";

export default function SideBar() {
  return (
    <div className="flex-col p-3 border-[#788f78] border-e-4 w-60 h-screen">
      <Link href="/store">
        <h1 className="mb-4 font-bold text-[#788f78] text-2xl">Register</h1>
      </Link>
      <Link href="/store/sales-register">
        <Button className="w-full">Sales register</Button>
      </Link>
      <Link href="/store/registry">
        <Button className="border-[#788f78] border-y-2 w-full">Registry</Button>
      </Link>
      <Link href="/store/products">
        <Button className="w-full">Products</Button>
      </Link>
    </div>
  );
}
