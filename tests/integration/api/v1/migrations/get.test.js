import orchestrator from "tests/orchestrator.js";

// Runs once before all tests: waits for the app to be up and starts from a clean database
// Roda uma vez antes de todos os testes: espera a app subir e começa com um banco limpo
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      // GET should only report ("simulate") pending migrations, never apply them
      // GET deve apenas informar ("simular") migrations pendentes, nunca aplicá-las
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
