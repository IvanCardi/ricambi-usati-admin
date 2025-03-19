/* eslint-disable @typescript-eslint/no-explicit-any */
export type ServerActionResponse =
  | { status: "ok"; data?: any }
  | { status: "error"; message: string };
