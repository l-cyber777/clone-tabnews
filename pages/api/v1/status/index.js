// Imports the database module created in infra/
// Importa o módulo database.js que criamos em infra/
import database from "infra/database.js";

// Main function of the /api/v1/status endpoint
// Função principal do endpoint /api/v1/status
// Receives the request and sends the response
// Recebe a requisição (request) e envia a resposta (response)
async function status(request, response) {
  // Gets the current date and time in ISO 8601 format
  // Pega a data e hora atual no formato ISO 8601
  const updatedAt = new Date().toISOString();

  // Fetches the PostgreSQL version with a SQL query
  // Busca a versão do PostgreSQL com uma query SQL
  const databaseVersionResult = await database.query("SHOW server_version;");

  // Gets the version value from the result
  // Pega o valor da versão do resultado
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  // Fetches the maximum number of connections allowed
  // Busca o número máximo de conexões permitidas
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  // Gets the max connections value from the result
  // Pega o valor do máximo de conexões do resultado
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  // Fetches the number of currently opened connections
  // Busca o número de conexões abertas no momento
  const databaseOpenedConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = current_database();",
  );

  // Gets the opened connections count from the result
  // Pega a contagem de conexões abertas do resultado
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  // Responds with status 200 (OK) and a JSON with the database info
  // Responde com status 200 (OK) e um JSON com as informações do banco
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      // ← fixed typo / corrigido erro de digitação
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue), // ← fixed typo / corrigido
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

// Exports the function so Next.js can use it as an endpoint
// Exporta a função para o Next.js conseguir usar como endpoint
export default status;
