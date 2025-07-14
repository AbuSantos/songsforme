// // Since we're removing wagmi entirely, we'll simplify this config
// // and use thirdweb's built-in providers instead

// export function getConfig() {
//   // This function is no longer needed since we're using thirdweb's built-in providers
//   // We'll keep it for compatibility but it won't be used
//   return {};
// }

// declare module "thirdweb" {
//   interface Register {
//     config: ReturnType<typeof getConfig>;
//   }
// }
