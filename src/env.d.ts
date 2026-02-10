/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "*.yml" {
  const data: unknown;
  export default data;
}

declare module "*.yaml" {
  const data: unknown;
  export default data;
}
