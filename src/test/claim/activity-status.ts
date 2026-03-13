import instance from "../../client/api.ts";
import { TokentStore } from "../../client/api.ts";
import { CONFIG } from "../../config/index.ts";
import { ActivityStatusReq, ActivityStatusRes, ResponseWrapper } from "../../type/index.ts";

const EXPECTED = [
  {
    status: "Notification",
    description: "Claim is in notification state, waiting for claimant to select assessor option."
  },
  {
    status: "Assessor Option",
    description: "Claim is in assessor option state, waiting for claimant to select assessor option."
  },
  {
    status: "Reviewing",
    description: "Claim is in reviewing state, waiting for claim owner to submit loss adjuster report."
  },
  {
    status: "Confirmation",
    description: "Claim is in confirmation state, waiting for claim owner to confirm the claim settlement."
  },
  {
    status: "Selection",
    description: "Claim is in selection state, waiting for co-insurers to respond on assessor option selection."
  },
  {
    status: "Reporting",
    description: "Claim is in reporting state, waiting for claim owner to submit loss adjuster report."
  },
  {
    status: "Settlement",
    description: "Claim is in settlement state, claim settlement process is completed."
  }
];

const CANCELLED = {
  status: "Cancelled",
  description: "Claim is cancelled, no further action can be taken on this claim."
};

// ── Curl Helper ────────────────────────────────
function printCurl(status: string): void {
  console.log(`   CURL    :`);
  console.log(`   curl -X POST '${CONFIG.baseURL}/claim-management/claim-owners/activity-status' \\`);
  console.log(`   -H 'Content-Type: application/json' \\`);
  console.log(`   -H 'Authorization: Bearer ${TokentStore.get()}' \\`);
  console.log(`   -d '{"status": "${status}"}'`);
}

// ── Single Status Test ─────────────────────────
async function testActivityStatus(status: string, expectedDescription: string): Promise<void> {
  try {
    const request: ActivityStatusReq = { status };

    const response = await instance.post(
      "/claim-management/claim-owners/activity-status",
      request
    );

    const data = response.data as ResponseWrapper<ActivityStatusRes>;

    // ── Check response exists ──────────────────────
    if (!data) {
      console.log(`❌ [${status}] Response    : FAIL - null or empty`);
      printCurl(status);
      return;
    }

    // ── Check status code ──────────────────────────
    if (data.status.code === 0 && data.status.message === "Success") {
      console.log(`✅ [${status}] Status Code : PASS`);
    } else {
      console.log(`❌ [${status}] Status Code : FAIL - ${data.status.code} ${data.status.message}`);
      printCurl(status);
      return;
    }

    // ── Check data array exists ────────────────────
    if (!data.data || data.data.length === 0) {
      console.log(`❌ [${status}] Data Array  : FAIL - null or empty`);
      printCurl(status);
      return;
    }

    // ── Check correct count ────────────────────────
    const isCancelled = status === "Cancelled";
    const expectedCount = isCancelled ? 8 : 7;

    if (data.data.length === expectedCount) {
      console.log(`✅ [${status}] Count       : PASS - got ${data.data.length} statuses`);
    } else {
      console.log(`❌ [${status}] Count       : FAIL - expected ${expectedCount}, got ${data.data.length}`);
      printCurl(status);
    }

    // ── Check all 6 base statuses present ─────────
    const returnedStatuses = data.data.map((item) => item.status);
    const missingStatuses = EXPECTED.filter((e) => !returnedStatuses.includes(e.status));

    if (missingStatuses.length === 0) {
      console.log(`✅ [${status}] Base Status : PASS - all 7 present`);
    } else {
      console.log(`❌ [${status}] Base Status : FAIL - missing: ${missingStatuses.map(e => e.status).join(", ")}`);
      printCurl(status);
    }

    // ── Check Cancelled presence ───────────────────
    const hasCancelled = returnedStatuses.includes("Cancelled");

    if (isCancelled && hasCancelled) {
      console.log(`✅ [${status}] Cancelled   : PASS - correctly included`);
    } else if (!isCancelled && hasCancelled) {
      console.log(`❌ [${status}] Cancelled   : FAIL - should not appear`);
      printCurl(status);
    } else if (!isCancelled && !hasCancelled) {
      console.log(`✅ [${status}] Cancelled   : PASS - correctly excluded`);
    } else if (isCancelled && !hasCancelled) {
      console.log(`❌ [${status}] Cancelled   : FAIL - should appear but missing`);
      printCurl(status);
    }

    // ── Check description ──────────────────────────
    const matchedItem = data.data.find((item) => item.status === status);

    if (!matchedItem) {
      console.log(`❌ [${status}] Description : FAIL - status not found in response`);
      printCurl(status);
      return;
    }

    if (matchedItem.description === expectedDescription) {
      console.log(`✅ [${status}] Description : PASS`);
    } else {
      console.log(`❌ [${status}] Description : FAIL`);
      console.log(`   Expected: "${expectedDescription}"`);
      console.log(`   Received: "${matchedItem.description}"`);
      printCurl(status);
    }

  } catch (error) {
    console.log(`❌ [${status}] Request failed`);
    console.log(`   Status  :`, error.response?.status);
    console.log(`   Message :`, error.response?.data || error.message);
    console.log(`   URL     :`, error.config?.url);
    console.log(`   Base URL:`, error.config?.baseURL);
    printCurl(status);
  }
}

// ── Run All Tests ──────────────────────────────
async function runActivityStatusTests(): Promise<void> {
  console.log("\n🧾 CLAIM ACTIVITY STATUS TESTS");

  // Test all 7 base statuses
  for (const item of EXPECTED) {
    await testActivityStatus(item.status, item.description);
    console.log("-".repeat(50));
  }

  // Test Cancelled — should return 8 statuses
  await testActivityStatus(CANCELLED.status, CANCELLED.description);
  console.log("-".repeat(50));
}

export default runActivityStatusTests;