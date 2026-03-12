import * as dotenv from "dotenv";
dotenv.config({ quiet: true });

console.log("BASE_URL   :", process.env.BASE_URL);
console.log("APP_USERNAME:", process.env.APP_USERNAME);
console.log("APP_PASSWORD:", process.env.APP_PASSWORD);

export const CONFIG = {
  baseURL: process.env.BASE_URL || "",
  accounts: {
    systemAdmin: {
      username: process.env.APP_USERNAME || "",
      password: process.env.APP_PASSWORD || "",
      role: "System Admin",
    },
  },
  delayBetweenTests: 500,
};