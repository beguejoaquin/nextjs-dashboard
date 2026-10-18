"use client";

import { Button } from "@/app/ui/button";
import { number } from "zod/v4";

export default function Cart(props: { number: number }) {
  //const items = localStorage.getItem(`cart${number}`);
  const items: [] = [];

  return (
    <div className="flex flex-col bg-white p-3 border-[#788f78] border-4 rounded-lg w-[300px] h-[500px]">
      <div className="h-fit header">
        <h1>Cart #{props.number}</h1>
      </div>
      <div className="flex flex-1 justify-center items-center my-3 border-[var(--brand-color)] border-y-4 content">
        {items ? items : <p>No items yet</p>}
      </div>
      <div className="flex justify-evenly footer">
        <Button>Finish</Button>
        <Button>Cancel</Button>
      </div>
    </div>
  );
}
