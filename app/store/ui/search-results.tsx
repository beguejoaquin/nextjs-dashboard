import { InvoicesTable } from "@/app/lib/definitions";

export default function SearchResults(props: {
  results: Array<InvoicesTable>;
}) {
  return (
    <div className="w-full h-[300px]">
      {props.results.map((result) => (
        <div>{result.name}</div>
      ))}
    </div>
  );
}
