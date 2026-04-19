// Importa o módulo database.js que criamos em infra/
// Os "../../../.." sobem 4 pastas até chegar na raiz do projeto
import database from "infra/database.js";

// Função principal do endpoint /api/v1/status
// Recebe a requisição (request) e envia a resposta (response)
async function status(request, response) {
  // Envia uma query para o banco de dados e aguarda o resultado
  // "as sum" dá um nome amigável para o resultado da soma
  const result = await database.query("SELECT 1 + 1 as sum;");

  // Mostra o resultado no terminal (útil para debug)
  console.log(result);

  // Responde com status 200 (OK) e um JSON com uma mensagem
  response.status(200).json({ chave: "são acima da médiaddede" });
}
// Exporta a função para o Next.js conseguir usar como endpoint
export default status;
