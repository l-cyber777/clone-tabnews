// Imports the official PostgreSQL driver for Node.js
// Importa o Client do driver oficial do PostgreSQL para Node.js
import { Client } from "pg";

// Function that executes any query on the database
// Função que executa qualquer query no banco de dados
async function query(queryObject) {
  // Creates a new connection with the local database settings
  // Cria uma nova conexão com as configurações do banco local
  const client = new Client({
    host: process.env.POSTGRES_HOST, // database address / endereço do banco
    port: process.env.POSTGRES_PORT, // default PostgreSQL port / porta padrão do PostgreSQL
    user: process.env.POSTGRES_USER, // default user / usuário padrão
    database: process.env.POSTGRES_DB, // database name / nome do banco
    password: process.env.POSTGRES_PASSWORD, // password defined in compose.yaml / senha definida no compose.yaml
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  try {
    // Opens the connection with the database
    // Abre a conexão com o banco
    await client.connect();

    // Executes the query and returns the result
    // Executa a query e retorna o resultado
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Always closes the connection — even if an error occurs!
    // Sempre fecha a conexão — mesmo se ocorrer um erro!
    await client.end();
  }
}

// Exports the query function to be used in other files
// Exporta a função query para ser usada em outros arquivos
export default {
  query: query,
};
