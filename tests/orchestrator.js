import retry from "async-retry";
import database from "infra/database.js";

async function waitForAllServices() {
  await waitForWebServer();
}

async function clearDatabase() {
  await database.query("DROP schema public cascade; create schema public;");
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    minTimeout: 100,
    maxTimeout: 1000,
  });
}

async function fetchStatusPage() {
  const response = await fetch("http://localhost:3000/api/v1/status");

  if (response.status !== 200) {
    throw new Error("");
  }
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
