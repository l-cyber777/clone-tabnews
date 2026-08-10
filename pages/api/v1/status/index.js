import database from "infra/database.js";

// API route handler for /api/v1/status — reports the app's health/status
// Handler da rota de API /api/v1/status — informa a saúde/status da aplicação
async function status(request, response) {
  // Current server timestamp in ISO format, so callers know how fresh this info is
  // Timestamp atual do servidor em formato ISO, para quem chamar saber o quão recente é essa info
  const updatedAt = new Date().toISOString();

  // Asks Postgres which version it's running
  // Pergunta ao Postgres qual versão ele está rodando
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  // Asks Postgres what's the maximum number of simultaneous connections it allows
  // Pergunta ao Postgres qual é o número máximo de conexões simultâneas que ele permite
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  // Counts how many connections are currently open on this specific database
  // (pg_stat_activity is a Postgres system view with live connection info)
  // Conta quantas conexões estão abertas neste banco especificamente
  // (pg_stat_activity é uma view do sistema do Postgres com informações de conexões ao vivo)
  const databaseOpenedConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = current_database();",
  );

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  // Returns everything as JSON so it's easy to consume by tests, monitoring tools, etc.
  // Retorna tudo como JSON para ser fácil de consumir por testes, ferramentas de monitoramento, etc.
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        // parseInt converts the string "100" into the number 100
        // parseInt converte a string "100" no número 100
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
