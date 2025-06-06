import { Label } from "@/components/ui/label";
import { Order } from "@/lib/models/order";
import {
  BadgeEuro,
  Calendar,
  Factory,
  Mail,
  Package,
  User,
} from "lucide-react";
import StatusProgressBar from "./statusProgressBar";
import moment from "moment";
import { ProductTable } from "./product-table";
import { productColumns } from "./product-columns";
import { PageProps } from "@/lib/pageProps";

async function getOrder(id: string): Promise<Order> {
  const orders = await fetch(`${process.env.BE_BASE_URL}/orders/${id}`);

  return (await orders.json()) as Order;
}

export default async function Details({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div className="p-10 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p className="font-bold">Stato</p>
        <StatusProgressBar status={order.status} orderId={order.id} />
      </div>
      <div className="mx-[200px] border border-gray-200 rounded-lg py-[24px] px-[80px] flex justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-gray-400 uppercase text-md">Utente</Label>
              {order.customer ? (
                order.customer?.type === "private" ? (
                  <User className="text-gray-400" />
                ) : (
                  <Factory className="text-gray-400" />
                )
              ) : (
                <>GUEST</>
              )}
            </div>
            <p>
              {order.customer
                ? order.customer.type === "private"
                  ? `${order.customer.firstName} ${order.customer.lastName}`
                  : order.customer.name
                : `${order.info.firstName} ${order.info.lastName}`}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-gray-400 uppercase text-md">Email</Label>
              <Mail className="text-gray-400" />
            </div>
            <p>{order.customer?.email ?? order.info.email}</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-gray-400 uppercase text-md">Creato</Label>
              <Calendar className="text-gray-400" />
            </div>
            <p>{moment(order.createdAt).format("DD/MM/YYYY HH:mm")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-gray-400 uppercase text-md">
                Indirizzo di spedizione
              </Label>
              <Package className="text-gray-400" />
            </div>
            <p>{`${order.address.streetName} ${
              order.address.streetName2 ?? ""
            } ${order.address.city ?? ""} ${
              order.address.postalCode ?? ""
            } ${order.address.province ?? ""} ${
              order.address.administrativeArea ?? ""
            } ${order.address.dependentLocality ?? ""} ${
              order.address.country
            }`}</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-gray-400 uppercase text-md">Totale</Label>
              <BadgeEuro className="text-gray-400" />
            </div>
            <p>{order.totalPrice} €</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-bold">Prodotti</p>
        <ProductTable
          columns={productColumns}
          data={order.products}
        ></ProductTable>
      </div>
    </div>
  );
}
