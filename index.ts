import { CONFIG } from "./src/config/index.ts";
import login from "./src/test/auth/index.ts";
import { runNegativeCases } from "./src/test/auth/index.ts";
import runActivityStatusTests from "./src/test/claim/activity-status.ts";
import { TokentStore } from "./src/client/api.ts";

async function main() {
  const response = await login({
    username: CONFIG.accounts.systemAdmin.username,
    password: CONFIG.accounts.systemAdmin.password
  });

  if (response === null) {
    console.log("❌ Loggin failed - stopping");
    return;
  }

  // Negative cases
  await runNegativeCases();

  // Activity status tests
  if (response == null) {
    console.log("❌ Login failed - stopping");
    return;
  }

  // Verify token was saved before running other tests
  if (!TokentStore.get()) {
    console.log("❌ No token found — stopping");
    return;
  }

  console.log("✅ Token ready — running tests");

  // Now run tests — token auto attached to every request
  await runActivityStatusTests();
}

main();