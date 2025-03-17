import { Address } from "@/lib/models/order";
import { orderColumns } from "./order-columns";
import { OrderTable } from "./order-table";

export type PartialOrderInfo = {
  id: string;
  totalPrice: number;
  createdAt: string;
  address: Address;
  status: string;
};
const getOrders = async (): Promise<PartialOrderInfo[]> => {
  const orders = await fetch(`${process.env.BE_BASE_URL}/orders`, {
    next: { tags: ["orders"] }, // Attach a revalidation tag
  });

  return (await orders.json()) as PartialOrderInfo[];
};

export default async function Orders() {
  const orders = await getOrders();

  return (
    <div className="p-10">
      <OrderTable columns={orderColumns} data={orders}></OrderTable>
    </div>
  );
}
