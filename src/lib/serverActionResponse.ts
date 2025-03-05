export type ServerActionResponse =
  | { status: "ok" }
  | { status: "error"; message: string };
