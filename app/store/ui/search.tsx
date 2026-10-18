"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

import { InvoicesTable } from "@/app/lib/definitions";
import { fetchFilteredInvoicesStore } from "@/app/store/lib/data";

import SearchResults from "@/app/store/ui/search-results";

export default function Search({ placeholder }: { placeholder: string }) {
  const [invoices, setInvoices] = useState(Array<InvoicesTable>);

  const handleSearch = useDebouncedCallback(async (term) => {
    const results = await fetchFilteredInvoicesStore(term);
    setInvoices(results);
    console.log("Results:", results);
    console.log("Invoices:", invoices);
  }, 500);

  return (
    <div
      id="search-bar"
      className="flex flex-col bg-white mx-auto my-5 p-3 rounded-lg w-fit"
    >
      <div className="relative flex flex-shrink-0 flex-1">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block py-[9px] pl-10 border border-gray-200 rounded-md outline-2 w-full placeholder:text-gray-500 text-sm"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <MagnifyingGlassIcon className="top-1/2 left-3 absolute w-[18px] h-[18px] text-gray-500 peer-focus:text-gray-900 -translate-y-1/2" />
      </div>
      {invoices && <SearchResults results={invoices} />}
      <p className="mt-2">
        Products will be added to Cart #1 · Select another cart bellow to switch
      </p>
    </div>
  );
}
