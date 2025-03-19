import { Badge } from "@/components/ui/badge";
import { CarPart } from "@/lib/models/carPart";

export default function CarPartStatusBadge({
  status,
}: {
  status: CarPart["status"];
}) {
  if (status === "available") {
    return <Badge className="bg-green-500">Disponibile</Badge>;
  }

  if (status === "pending payment") {
    return <Badge className="bg-orange-300">In Pagamento</Badge>;
  }

  return <Badge className="bg-slate-700">Venduto</Badge>;
}
