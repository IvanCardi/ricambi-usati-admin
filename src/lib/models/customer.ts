export type Customer =
  | {
      id: string;
      type: "private";
      firstName: string;
      lastName: string;
      email: string;
    }
  | {
      id: string;
      type: "company";
      name: string;
      vat: string;
      sdi: string;
      email: string;
      pec: string;
      isAutomotive: boolean;
    };
