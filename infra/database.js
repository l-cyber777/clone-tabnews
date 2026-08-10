// Imports the PostgreSQL client provided by the "pg" library
// Importa o cliente do PostgreSQL fornecido pela biblioteca "pg"
import { Client } from "pg";

// Runs a single query against the database and always closes the connection afterwards
// Executa uma única query no banco de dados e sempre fecha a conexão no final
async function query(queryObject) {
  let client;
  try {
    // Opens a brand new connection for this query
    // Abre uma conexão nova para esta query
    client = await getNewClient();

    // Sends the query (text + values) to Postgres and waits for the result
    // Envia a query (texto + valores) para o Postgres e aguarda o resultado
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    // Logs the real error on the server so it can be debugged...
    // Loga o erro real no servidor para poder ser depurado...
    console.error(error);
    // ...but re-throws it so the caller (e.g. an API route) decides how to respond
    // ...mas relança o erro para quem chamou (ex: uma rota de API) decidir como responder
    throw error;
  } finally {
    // Runs even if an error happened above, so the connection is never left open
    // Executa mesmo se der erro acima, garantindo que a conexão nunca fique aberta
    await client.end();
  }
}

// Creates and connects a new PostgreSQL client using credentials from environment variables
// Cria e conecta um novo cliente PostgreSQL usando credenciais vindas de variáveis de ambiente
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    // Decides whether/how to use an encrypted (SSL) connection
    // Decide se/como usar uma conexão criptografada (SSL)
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

// Public object exposed to the rest of the app: only "query" and "getNewClient" are exported
// Objeto público exposto ao restante da aplicação: só "query" e "getNewClient" são exportados
const database = {
  query,
  getNewClient,
};

export default database;

// Decides the SSL configuration for the database connection
// Decide a configuração de SSL para a conexão com o banco
function getSSLValues() {
  // If a custom certificate authority was provided (common in managed cloud databases),
  // use it to validate the connection
  // Se uma autoridade certificadora customizada foi fornecida (comum em bancos gerenciados
  // na nuvem), usa ela para validar a conexão
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  // Otherwise: force SSL in production, but allow plain connections in local development
  // Caso contrário: força SSL em produção, mas permite conexão sem criptografia em
  // desenvolvimento local
  return process.env.NODE_ENV === "production" ? true : false;
}
