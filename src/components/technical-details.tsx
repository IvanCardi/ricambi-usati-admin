import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { v4 } from "uuid";

export default function TechnicalDetails({
  details,
  setDetails,
  isDisabled,
}: {
  details: { id: string; label: string; value: string }[];
  setDetails: (details: { id: string; label: string; value: string }[]) => void;
  isDisabled: boolean;
}) {
  const getDetail = (id: string) => {
    return details.find((d) => d.id === id);
  };

  const setDetail = (id: string, type: "label" | "value", value: string) => {
    const detail = getDetail(id);

    if (detail) {
      const newDetail = { ...detail, [type]: value };

      setDetails(details.map((d) => (d.id === id ? newDetail : d)));
    }
  };

  const addDetail = () => {
    const newDetails = [...details];
    newDetails.push({ id: v4(), label: "", value: "" });
    setDetails(newDetails);
  };

  const removeDetail = (id: string) => {
    setDetails(details.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Dettagli Tecnici</Label>
      {details.map((d) => (
        <div key={d.id} className="flex gap-2 items-center">
          <Input
            className="w-full"
            placeholder="Etichetta"
            value={getDetail(d.id)?.label}
            onChange={(e) => setDetail(d.id, "label", e.target.value)}
          />
          <Input
            className="w-full"
            placeholder="Valore"
            value={getDetail(d.id)?.value}
            onChange={(e) => setDetail(d.id, "value", e.target.value)}
          />
          <Button type="button" size={"sm"} onClick={() => removeDetail(d.id)}>
            <Trash />
          </Button>
        </div>
      ))}
      <Button
        className="w-fit"
        onClick={addDetail}
        type="button"
        size={"sm"}
        disabled={isDisabled}
      >
        Aggiungi
      </Button>
    </div>
  );
}
