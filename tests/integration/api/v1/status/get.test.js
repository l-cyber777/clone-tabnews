import orchestrator from "tests/orchestrator.js";

// Runs once, before any test in this file, to make sure the app + database are ready
// Roda uma vez, antes de qualquer teste deste arquivo, para garantir que a app + banco estão prontos
beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retriving current system status", async () => {
      // Calls the real endpoint over HTTP, exactly like a real client would
      // Chama o endpoint de verdade via HTTP, exatamente como um cliente real faria
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      // Checks that "updated_at" is a valid, well-formatted ISO date string
      // Verifica que "updated_at" é uma data ISO válida e bem formatada
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      // Checks the database info reported by the endpoint matches what's expected
      // in this local Docker environment (see infra/compose.yaml)
      // Verifica se as infos do banco relatadas pelo endpoint batem com o esperado
      // neste ambiente local do Docker (ver infra/compose.yaml)
      expect(responseBody.dependencies.database.version).toEqual("16.0");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
