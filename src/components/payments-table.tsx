import { columns, Payment } from "./payments/columns";
import { DataTable } from "./payments/data-table";

const data: Payment[] = [
    {
      id: "m5gr84i9",
      amount: 316,
      status: "success",
      email: "ken99@yahoo.com",
      month: "Janeiro"
    },
    {
      id: "3u1reuv4",
      amount: 242,
      status: "success",
      email: "Abe45@gmail.com",
      month: "Janeiro"
    },
    {
      id: "derv1ws0",
      amount: 837,
      status: "processing",
      email: "Monserrat44@gmail.com",
      month: "Janeiro"
    },
    {
      id: "5kma53ae",
      amount: 874,
      status: "success",
      email: "Silas22@gmail.com",
      month: "Janeiro"
    },
    {
      id: "bhqecj4p",
      amount: 721,
      status: "failed",
      email: "carmella@hotmail.com",
      month: "Janeiro"
    },
  ]
export function PaymentsTable() {
  return <DataTable columns={columns} data={data} />;
}
