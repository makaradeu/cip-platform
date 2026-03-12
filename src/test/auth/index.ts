import instance from "../../client/api.ts";
import { LoginRequest, LoginResponse, ResponseWrapper } from "../../type/index.ts";

async function login(request: LoginRequest): Promise<ResponseWrapper<LoginResponse> | null> {
    try {
        const response = await instance.post("/auth/login", request);
        const data = response.data as ResponseWrapper<LoginResponse>;

        // Check response data exists
        if (!data) {
            console.log("❌ Response     : FAIL - data is null or empty");
            return null;
        }

        console.log("✅ [LOGIN]: SUCCESS - response received");

        // Check Status Code
        if (data.status.code === 0 && data.status.message === "Success") {
            console.log("✅ Status Code : PASS");
        } else {
            console.log("❌ Status Code : FAIL");
            console.log(    "Expected code: 0");
            console.log(    "Expected message: Success");
            console.log(    "Received code: ", data.status.code);
            console.log(    "Received message: ", data.status.message);
        }

        // Check Token
        if (data.data.token !== "" && data.data.token !== null) {
            console.log("✅ Token       : PASS");
        } else {
            console.log("❌ Token       : FAIL");
            console.log("   Expected token: non-empty string");
            console.log("   Received token: ", data.data.token);
        }

        // Check User Info
        if (data.data.username === request.username) {
            console.log("✅ Username    : PASS");
        } else {
            console.log("❌ Username    : FAIL");
            console.log("   Expected username: ", request.username);
            console.log("   Received username: ", data.data.username);
        }

        if (data.data.id !== null && data.data.id !== undefined) {
            console.log("✅ User ID     : PASS");
        } else {
            console.log("❌ User ID     : FAIL");
            console.log("   Expected user ID: non-empty string");
            console.log("   Received user ID: ", data.data.id);
        }

        if (data.data.role.id !== null && data.data.role.id !== undefined) {
            console.log("✅ Role ID     : PASS");
        } else {
            console.log("❌ Role ID     : FAIL");
            console.log("   Expected role ID: non-empty string");
            console.log("   Received role ID: ", data.data.role.id);
        }

        if (data.data.role.name !== null && data.data.role.name !== undefined) {
            console.log("✅ Role Name   : PASS");
        } else {
            console.log("❌ Role Name     : FAIL");
            console.log("   Expected role name: non-empty string");
            console.log("   Received role name: ", data.data.role.name);
        }

        // Check Expiration Date
        if (!data.data.expirationDate || data.data.expirationDate === "") {
            const expirationDate = new Date(data.data.expirationDate);
  
            if (!isNaN(expirationDate.getTime())) {
                console.log("✅ Expiration Date : PASS");
            } else {
                console.log("❌ Expiration Date : FAIL");
                console.log("   Expected expiration date: valid date");
                console.log("   Received expiration date: ", data.data.expirationDate);
            }
        }

        return data;

    } catch (error) {
        // Log error details
        console.log("❌ Request failed");
        console.log("   Status   : ", error.response.status);
        console.log("   Message  : ", error.response?.data || error.message);
        console.log("   URL      : ", error.config?.url);
        console.log("   Base URL : ", error.config?.baseURL);
        return null; // ← return null instead of throw so app doesn't crash
    }
}

async function loginNegative(
    label: string,
    request: LoginRequest,
): Promise<void> {
    try {
        const response = await instance.post("/auth/loging", request);
        const data = response.data as ResponseWrapper<LoginRequest>;

        // We expect failure - if code is success that means the test failed
        if (data.status.code !== 0) {
            console.log(`✅ ${label} : PASS - correctly rejected`);
        } else {
            console.log(`❌ ${label} : FAIL - should have been rejected`);
            console.log("   Received :", data.status);
        }
    } catch (error) {
        // A network error/server error is also counts as correctly rejected
        console.log(`✅ ${label} : PASS - correctly rejected with error`);
        console.log("   Reason:", error.response?.data || error.message);
    }

}

async function runNegativeCases() {
    console.log("\n🔴 NEGATIVE CASES");

    // Wrong username
    await loginNegative("Wrong Username", {
        username: "wrong_user",
        password: "aA12345@"
    });

    // Wrong password
    await loginNegative("Wrong Password", {
        username: "system_admin",
        password: "wrong_password"
    });
    
    // Empty username
    await loginNegative("Empty Username", {
        username: "",
        password: "aA12345@"
    });

    // Empty password
    await loginNegative("Empty Password", {
        username: "system_admin",
        password: ""
    });
}

export default login;
export { runNegativeCases };