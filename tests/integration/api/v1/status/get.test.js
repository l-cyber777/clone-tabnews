// Teste de integração — verifica se o endpoint /status está respondendo corretamente
test("GET to /api/v1/status should return 200", async () => {
  // Faz uma requisição GET para o endpoint /status e aguarda a resposta
  const response = await fetch("http://localhost:3000/api/v1/status");

  // Verifica se o status da resposta é 200 (OK)
  expect(response.status).toBe(200);

  // Converte o corpo da resposta para JSON
  const responseBody = await response.json();

  // Converte o updated_at recebido para o formato ISO string
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();

  // Verifica se o updated_at é uma data válida no formato ISO 8601
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  // Verifica se a versão do banco de dados é "16.0"
  expect(responseBody.dependecies.database.version).toEqual("16.0");
  expect(responseBody.dependecies.database.max_connections).toEqual(100);
});
