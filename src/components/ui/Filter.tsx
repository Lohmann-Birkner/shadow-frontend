import { Column, FilterFn, Table } from "@tanstack/react-table";
import { MedicalServiceT } from "../../../types";
import { Search } from "lucide-react";

export function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const aaa = table.getRowModel().rows.map((row) => row.original);

  const bbb = aaa.map((aa) => {
    return aa.Start_Treatment;
  });
  const columnsInTable = column.id;
  const columnFilterValue = column.getFilterValue();
  return typeof firstValue === "number" ? (
    <>
      <div className="flex space-x-2 mt-2 ">
        <input
          type="number"
          //value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className="w-20 border shadow rounded h-7"
        />
        <input
          type="number"
          // value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
          className="w-20 border shadow rounded h-7"
        />
      </div>
      <div className="flex items-center py-2">
        <input
          placeholder="Search..."
          // value={(columnFilterValue as string) ?? ""}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="max-w-sm w-27 border shadow rounded h-7"
        />
      </div>
    </>
  ) : columnsInTable === "Start_Treatment" ||
    columnsInTable === "End_Treatment" ? (
    <input
      type="date"
      className="max-w-sm w-27 border shadow rounded h-7 mt-2"
      onChange={(e) => column.setFilterValue(e.target.value)}
    />
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded h-7 mt-2 "
    />
  );
}
