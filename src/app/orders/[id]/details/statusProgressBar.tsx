"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/lib/models/order";
import { useState, useTransition } from "react";
import { markAsShipped } from "./actions";

const statusData = {
  created: { value: 25, color: "bg-blue-400", label: "Creato" },
  "in payment": { value: 50, color: "bg-orange-300", label: "In Pagamento" },
  paid: { value: 75, color: "bg-green-500", label: "Pagato" },
  shipped: { value: 100, color: "bg-gray-800", label: "Spedito" },
};

export default function StatusProgressBar(props: {
  status: Order["status"];
  orderId: string;
}) {
  const [status, setStatus] = useState(props.status);
  const { value, color, label } = statusData[status];
  const [isPending, startTransition] = useTransition();

  const onShippedClick = () => {
    startTransition(async () => {
      const response = await markAsShipped(props.orderId);

      if (response.status === "ok") {
        setStatus("shipped");
      }
    });
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <p
        className="absolute top-2 text-sm font-bold text-gray-800"
        style={{ left: `calc(${value}% - 30px)` }} // Adjust position dynamically
      >
        {label}
      </p>
      {status === "paid" && (
        <div className="flex justify-end mt-4">
          <Button size={"sm"} onClick={onShippedClick} disabled={isPending}>
            Spedisci
          </Button>
        </div>
      )}
    </div>
  );
}
