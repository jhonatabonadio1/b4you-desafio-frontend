import { columns, Campaing } from "./campaing/columns";
import { DataTable } from "./campaing/data-table";

const data: Campaing[] = [
    {
      id: "m5gr84i9",
      nome: "Teste",
      orcamento: 20000,
      status: "ativo",
    },
   
  ]
export function CampaingsTable() {
  return <DataTable columns={columns} data={data} />;
}
