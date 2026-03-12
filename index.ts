import { CONFIG } from "./src/config/index.ts";
import login from "./src/test/auth/index.ts";
import { runNegativeCases } from "./src/test/auth/index.ts";

async function main() {
  const response = await login({
    username: CONFIG.accounts.systemAdmin.username,
    password: CONFIG.accounts.systemAdmin.password
  });

  // Negative cases
  await runNegativeCases();

  // if (response === null) {
  //   console.log("❌ Login failed - response is null");
  //   console.log("❌ Login failed - stoping");
  //   return;
  // }

  // console.log("Login response: ", response);
}

main();