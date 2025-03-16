import { Order } from "@/lib/models/order";
import { OrderTable } from "./order-table";
import { orderColumns } from "./order-columns";

const getOrders = async (): Promise<Order[]> => {
  const orders = await fetch(`${process.env.BE_BASE_URL}/orders`, {
    next: { tags: ["orders"] }, // Attach a revalidation tag
  });

  return (await orders.json()) as Order[];
};

export default async function Orders() {
  const orders = await getOrders();

  return (
    <div className="p-10">
      <OrderTable columns={orderColumns} data={orders}></OrderTable>
    </div>
  );
}
