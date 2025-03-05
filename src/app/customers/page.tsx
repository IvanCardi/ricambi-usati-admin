import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from "@/lib/models/customer";
import { CustomerTable } from "./customer-table";
import {
  companyCustomerColumns,
  privateCustomerColumns,
} from "./customer-columns";

const getCustomers = async (): Promise<Customer[]> => {
  const customers = await fetch(`${process.env.BE_BASE_URL}/customers`);

  return (await customers.json()) as Customer[];
};

export default async function Customers() {
  const customers = await getCustomers();

  return (
    <div className="p-10">
      <Tabs defaultValue="company">
        <TabsList className="w-[300px]">
          <TabsTrigger value="company">Aziende</TabsTrigger>
          <TabsTrigger value="private">Privati</TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="mt-2">
          <CustomerTable
            columns={companyCustomerColumns}
            data={customers.filter((c) => c.type === "company")}
          ></CustomerTable>
        </TabsContent>
        <TabsContent value="private" className="mt-2">
          <CustomerTable
            columns={privateCustomerColumns}
            data={customers.filter((c) => c.type === "private")}
          ></CustomerTable>
        </TabsContent>
      </Tabs>
    </div>
  );
}
