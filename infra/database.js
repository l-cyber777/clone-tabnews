// Imports the official PostgreSQL driver for Node.js
// Importa o Client do driver oficial do PostgreSQL para Node.js
import { Client } from "pg";

// Async function that executes any SQL query on the database
// Função assíncrona que executa qualquer query SQL no banco de dados
// Receives a queryObject as parameter (the query to be executed)
// Recebe um queryObject como parâmetro (a query a ser executada)
async function query(queryObject) {
  // Creates a new PostgreSQL client instance with connection settings
  // Cria uma nova instância do client PostgreSQL com as configurações de conexão
  const client = new Client({
    // Database host address — read from environment variable
    // Endereço do host do banco — lido de variável de ambiente
    host: process.env.POSTGRES_HOST,

    // Connection port — PostgreSQL default is 5432
    // Porta de conexão — padrão do PostgreSQL é 5432
    port: process.env.POSTGRES_PORT,

    // Username to authenticate with the database
    // Usuário para autenticar no banco
    user: process.env.POSTGRES_USER,

    // Name of the database to connect to
    // Nome do banco de dados ao qual conectar
    database: process.env.POSTGRES_DB,

    // Password defined in compose.yaml (local) or in Vercel (production)
    // Senha definida no compose.yaml (local) ou na Vercel (produção)
    password: process.env.POSTGRES_PASSWORD,

    // Enables SSL only in production (Neon requires it, local Docker doesn't)
    // Habilita SSL apenas em produção (Neon exige, Docker local não precisa)
    // Ternary operator: if NODE_ENV is "production" then true, otherwise false
    // Operador ternário: se NODE_ENV for "production" então true, caso contrário false
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  // try/catch/finally block — handles errors and ensures connection cleanup
  // Bloco try/catch/finally — trata erros e garante limpeza da conexão
  try {
    // Opens the connection with the database
    // Abre a conexão com o banco
    // await waits until the connection is established before continuing
    // await aguarda até que a conexão seja estabelecida antes de continuar
    await client.connect();

    // Executes the SQL query and stores the result
    // Executa a query SQL e armazena o resultado
    // The result contains the returned rows, metadata, and other info
    // O result contém as linhas retornadas, metadados e outras informações
    const result = await client.query(queryObject);

    // Returns the result to whoever called this function
    // Retorna o resultado para quem chamou essa função
    return result;
  } catch (error) {
    // Captured if anything inside the try block fails
    // Capturado se algo dentro do bloco try falhar
    // Logs the error in the console (visible in Vercel logs in production)
    // Loga o erro no console (visível nos logs da Vercel em produção)
    console.error(error);

    // Re-throws the error so the caller knows something went wrong
    // Re-lança o erro para que quem chamou saiba que algo deu errado
    throw error;
  } finally {
    // Always runs — whether the try succeeded or the catch was triggered
    // Sempre executa — tanto se o try deu certo quanto se o catch foi disparado
    // Closes the connection to free up the database connection slot
    // Fecha a conexão para liberar o slot de conexão no banco
    // Critical to avoid hitting the max_connections limit!
    // Crítico para evitar atingir o limite de max_connections!
    await client.end();
  }
}

// Exports the query function as the default export of this module
// Exporta a função query como exportação padrão deste módulo
// Allows other files to import and use the query function
// Permite que outros arquivos importem e usem a função query
// Usage example: import database from "infra/database.js"; database.query(...)
// Exemplo de uso: import database from "infra/database.js"; database.query(...)
export default {
  query: query,
};
