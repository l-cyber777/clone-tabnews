import orchestrator from "tests/orchestrator.js";

// Runs once before all tests: waits for the app to be up and starts from a clean database
// Roda uma vez antes de todos os testes: espera a app subir e começa com um banco limpo
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        // Database is empty here, so this run should actually apply migrations
        // O banco está vazio aqui, então essa execução deve de fato aplicar as migrations
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        // 201 Created: at least one migration was applied
        // 201 Created: pelo menos uma migration foi aplicada
        expect(response1.status).toBe(201);

        const response1Body = await response1.json();

        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        // Running it again right after should find nothing left to migrate
        // Rodar de novo logo em seguida não deve encontrar nada para migrar
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        // 200 OK (not 201): nothing new was created this time
        // 200 OK (não 201): nada novo foi criado desta vez
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();

        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
