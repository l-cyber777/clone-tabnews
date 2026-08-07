// "runner" from node-pg-migrate is what actually reads the migration files and runs them
// "runner" do node-pg-migrate é quem de fato lê os arquivos de migration e executa eles
import { runner as migrationRunner } from "node-pg-migrate";
// Node's built-in helper to build file paths that work on any operating system
// Helper nativo do Node para montar caminhos de arquivo que funcionam em qualquer sistema operacional
import { join } from "node:path";
import database from "infra/database.js";

// API route handler for /api/v1/migrations
// Handler da rota de API /api/v1/migrations
export default async function migrations(request, response) {
  // Only GET (list pending migrations) and POST (run them) make sense here
  // Só GET (listar migrations pendentes) e POST (executar elas) fazem sentido aqui
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    // Any other HTTP method (PUT, DELETE, PATCH...) is rejected with 405
    // Qualquer outro método HTTP (PUT, DELETE, PATCH...) é rejeitado com 405
    return response.status(405).json({
      error: `Method "${request.method}" not alowed`,
    });
  }

  let dbClient;

  try {
    // Opens one database connection to be reused by this whole request
    // Abre uma conexão com o banco para ser reutilizada durante toda a requisição
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      // dryRun: true means "simulate only, don't change the database yet"
      // dryRun: true significa "só simular, ainda não altera o banco"
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      // Name of the internal table Postgres uses to track which migrations already ran
      // Nome da tabela interna que o Postgres usa para controlar quais migrations já rodaram
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      // GET only simulates (dryRun stays true), so it's safe: it just reports what's pending
      // GET só simula (dryRun continua true), então é seguro: apenas informa o que está pendente
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      // POST overrides dryRun to false, meaning it actually applies the migrations
      // POST sobrescreve dryRun para false, ou seja, aplica as migrations de verdade
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        // 201 Created: something new was actually migrated
        // 201 Created: algo novo foi de fato migrado
        return response.status(201).json(migratedMigrations);
      }

      // 200 OK with an empty list: nothing new to migrate, database was already up to date
      // 200 OK com lista vazia: nada novo para migrar, banco já estava atualizado
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    // Logs the full error on the server, but the client never sees these details
    // Loga o erro completo no servidor, mas o cliente nunca vê esses detalhes
    console.error(error);
    throw error;
  } finally {
    // Always closes the connection, whether the request succeeded or failed
    // Sempre fecha a conexão, tenha a requisição dado certo ou não
    await dbClient.end();
  }
}
