import { createDirectus, rest } from "@directus/sdk";

export const directus = createDirectus(process.env.REACT_APP_API_URL).with(rest());
