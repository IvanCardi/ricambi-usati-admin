export type Order = {
  id: string;
  user:
    | {
        id: string;
        type: "private";
        firstName: string;
        lastName: string;
      }
    | { id: string; type: "company"; name: string };
  address: Address;
  products: {
    id: string;
    name: string;
    photo: string;
    description: string;
  }[];
  status: "created" | "in payment" | "paid" | "shipped";
};

export type Address = {
  street: string;
  number: string;
  zipCode: string;
  province: string;
  city: string;
  state: string;
};
