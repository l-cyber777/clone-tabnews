// Integration test — checks if the /status endpoint is responding correctly
// Teste de integração — verifica se o endpoint /status está respondendo corretamente
test("GET to /api/v1/status should return 200", async () => {
  // Makes a GET request to the /status endpoint and waits for the response
  // Faz uma requisição GET para o endpoint /status e aguarda a resposta
  const response = await fetch("http://localhost:3000/api/v1/status");

  // Checks if the response status is 200 (OK)
  // Verifica se o status da resposta é 200 (OK)
  expect(response.status).toBe(200);

  // Converts the response body to JSON
  // Converte o corpo da resposta para JSON
  const responseBody = await response.json();

  // Converts the received updated_at to ISO string format
  // Converte o updated_at recebido para o formato ISO string
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();

  // Checks if updated_at is a valid date in ISO 8601 format
  // Verifica se o updated_at é uma data válida no formato ISO 8601
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  // Checks if the database version is "16.0"
  // Verifica se a versão do banco de dados é "16.0"
  expect(responseBody.dependencies.database.version).toEqual("16.0");

  // Checks if max connections equals 100
  // Verifica se o máximo de conexões é igual a 100
  expect(responseBody.dependencies.database.max_connections).toEqual(100);

  // Checks if opened connections equals 1
  // Verifica se as conexões abertas é igual a 1
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
