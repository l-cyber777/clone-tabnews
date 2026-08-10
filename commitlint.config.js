// Configures commitlint to enforce the "Conventional Commits" pattern
// (e.g. "feat: ...", "fix: ...", "chore: ...") on every commit message
// Configura o commitlint para exigir o padrão "Conventional Commits"
// (ex: "feat: ...", "fix: ...", "chore: ...") em toda mensagem de commit
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
