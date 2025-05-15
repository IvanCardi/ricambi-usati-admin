export type Order = {
  id: string;
  customer?:
    | {
        id: string;
        type: "private";
        email: string;
        firstName: string;
        lastName: string;
      }
    | { id: string; type: "company"; name: string; email: string };
  address: {
    streetName: string;
    streetName2?: string;
    city?: string;
    country: string;
    province?: string;
    administrativeArea?: string;
    dependentLocality?: string;
    postalCode?: string;
  };
  products: {
    id: string;
    name: string;
    photo: string;
    description: string;
    price: number;
    discountedPrice?: number;
  }[];
  status: string;
  totalPrice: number;
  createdAt: string;
  info: {
    firstName: string;
    lastName: string;
    email: string;
    details?: string;
  };
};

export type Address = {
  streetName: string;
  streetName2?: string;
  city?: string;
  country: string;
  province?: string;
  administrativeArea?: string;
  dependentLocality?: string;
  postalCode?: string;
};
