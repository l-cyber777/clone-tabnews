// Library that retries a function multiple times until it succeeds (or gives up)
// Biblioteca que tenta executar uma função várias vezes até dar certo (ou desistir)
import retry from "async-retry";
import database from "infra/database.js";

// Helper functions shared by the test suite to prepare the environment before tests run
// Funções auxiliares compartilhadas pelos testes para preparar o ambiente antes de rodarem
async function waitForAllServices() {
  await waitForWebServer();

  // Keeps trying to reach the app's /status endpoint until it responds successfully
  // Fica tentando alcançar o endpoint /status da aplicação até ele responder com sucesso
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      // Tries up to 100 times before giving up — useful because "next dev" and the
      // database can take a few seconds to be ready when tests start
      // Tenta até 100 vezes antes de desistir — útil porque o "next dev" e o banco
      // podem levar alguns segundos para ficarem prontos quando os testes começam
      retries: 100,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      // If the server isn't up yet, this fetch/parse throws, and "retry" tries again
      // Se o servidor ainda não estiver de pé, esse fetch/parse dá erro, e o "retry" tenta de novo
      await response.json();
    }
  }
}

// Wipes the entire "public" schema and recreates it empty, so every test file starts
// from a completely clean database (no leftover tables/rows from previous tests)
// Apaga todo o schema "public" e recria ele vazio, para que cada arquivo de teste comece
// com um banco de dados totalmente limpo (sem tabelas/linhas deixadas por testes anteriores)
async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
