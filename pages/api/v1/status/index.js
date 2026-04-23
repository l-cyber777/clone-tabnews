// Importa o módulo database.js que criamos em infra/
// Os "../../../.." sobem 4 pastas até chegar na raiz do projeto
import database from "infra/database.js";

// Função principal do endpoint /api/v1/status
// Recebe a requisição (request) e envia a resposta (response)
async function status(request, response) {
  const updatedAt = new Date().toISOString();

  // Busca a versão do PostgreSQL com uma query SQL
  const databaseVersionResult = await database.query("SHOW server_version;");

  // Pega o valor da versão do resultado
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  // Responde com status 200 (OK) e um JSON com uma mensagem
  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
      },
    },
  });
}

// Exporta a função para o Next.js conseguir usar como endpoint
export default status;
