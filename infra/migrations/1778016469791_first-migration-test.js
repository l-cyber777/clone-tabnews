/* eslint-disable camelcase, no-unused-vars */

// "shorthands" lets you define reusable column presets; not used yet in this migration
// "shorthands" permite definir presets reutilizáveis de coluna; ainda não usado nesta migration
exports.shorthands = undefined;

// Runs when migrating FORWARD (applying this migration) — "pgm" is the migration builder
// used to create/alter tables, columns, indexes, etc. Currently empty: this is just
// a placeholder/test migration to prove the migrations system works end-to-end
// Roda ao migrar PARA FRENTE (aplicando esta migration) — "pgm" é o construtor de
// migration usado para criar/alterar tabelas, colunas, índices, etc. Atualmente vazia:
// é só uma migration de teste/placeholder para provar que o sistema de migrations funciona
exports.up = (pgm) => {};

// Runs when migrating BACKWARD (undoing this migration) — should reverse whatever "up" did
// Roda ao migrar PARA TRÁS (desfazendo esta migration) — deve reverter o que "up" fez
exports.down = (pgm) => {};
