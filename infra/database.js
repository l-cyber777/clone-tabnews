// Importa o Client do driver oficial do PostgreSQL para Node.js
import { Client } from "pg";

// Função que executa qualquer query no banco de dados
async function query(queryObject) {
  // Cria uma nova conexão com as configurações do banco local
  const client = new Client({
    host: process.env.POSTGRES_HOST, // endereço do banco (nossa máquina)
    port: process.env.POSTGRES_PORT, // porta padrão do PostgreSQL
    user: process.env.POSTGRES_USER, // usuário padrão
    database: process.env.POSTGRES_DB, // nome do banco
    password: process.env.POSTGRES_PASSWORD, // senha definida no compose.yaml
  });
  await client.connect(); // abre a conexão com o banco
  const result = await client.query(queryObject); // executa a query
  await client.end(); // fecha a conexão após usar (boa prática!)
  return result; // devolve o resultado para quem chamou
}

// Exporta a função query para ser usada em outros arquivos
export default {
  query: query,
};
