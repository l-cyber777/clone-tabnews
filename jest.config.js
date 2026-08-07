// Loads environment variables (like database credentials) from .env.development
// before the tests run, so process.env.* is filled in
// Carrega variáveis de ambiente (como credenciais do banco) do .env.development
// antes dos testes rodarem, para que process.env.* fique preenchido
const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

// Next.js's own helper to build a Jest config that understands Next's setup
// (aliases, Babel/SWC transforms, etc.)
// Helper do próprio Next.js para montar uma config de Jest que entenda a estrutura
// do Next (aliases, transforms do Babel/SWC, etc.)
const nextJest = require("next/jest");

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
  // Allows imports like "infra/database.js" instead of long relative paths ("../../..")
  // Permite imports como "infra/database.js" em vez de caminhos relativos longos ("../../..")
  moduleDirectories: ["node_modules", "<rootDir>"],
  // Fails a test if it takes longer than 6 seconds (avoids tests hanging forever)
  // Falha um teste se ele demorar mais de 6 segundos (evita testes travados para sempre)
  testTimeout: 6000,
});

module.exports = jestConfig;
