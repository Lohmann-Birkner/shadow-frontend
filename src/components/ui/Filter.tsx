import { Column, FilterFn, Table } from "@tanstack/react-table";
import { MedicalServiceT } from "../../../types";
import { Search } from "lucide-react";
import { useIntl } from "react-intl";

export function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const { formatMessage } = useIntl();

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnsInTable = column.id;
  return typeof firstValue === "number" ? (
    <>
      <div className="flex space-x-2 ml-2 py-2">
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
      <div className="flex items-center pb-2 ml-2">
        <input
          placeholder={formatMessage({
            id: "filter",
          })}
          // value={(columnFilterValue as string) ?? ""}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="max-w-sm w-27 border shadow rounded h-7"
        />
      </div>
    </>
  ) : columnsInTable === "Start_Treatment" ||
    columnsInTable === "Issue_date" ||
    columnsInTable === "End_Treatment" ||
    columnsInTable === "Start_work_inability" ||
    columnsInTable === "End_work_inability" ||
    columnsInTable === "Start_EEL" ||
    columnsInTable === "End_EEL" ||
    columnsInTable === "Start_rehab" ||
    columnsInTable === "Date_prescription" ? (
    <div className="flex space-x-2 ml-2 py-2">
      <input
        type="date"
        className="max-w-sm w-27 border shadow rounded h-7 py-2 mb-2 ml-2"
        onChange={(e) => column.setFilterValue(e.target.value)}
      />
    </div>
  ) : (
    <div className="flex space-x-2 ml-2 py-2">
      <input
        type="text"
        //value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={formatMessage({
          id: "filter",
        })}
        className="w-36 border shadow rounded h-7 py-2 ml-2"
      />
    </div>
  );
}
