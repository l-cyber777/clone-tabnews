// Teste de integração — verifica se o endpoint /status está respondendo corretamente
test("GET to /api/v1/status should return 200", async () => {
  // Faz uma requisição GET para o endpoint /status e aguarda a resposta
  const response = await fetch("http://localhost:3000/api/v1/status");

  // Verifica se o status da resposta é 200 (OK)
  expect(response.status).toBe(200);
});
