-- Posición en la tabla de agradecimientos de un programa de HackerOne.
--
-- Una fila por programa: el worker la reescribe desde su cron. Guardar el
-- histórico no aporta nada aquí, así que se sobreescribe.

CREATE TABLE IF NOT EXISTS hackerone_rank (
    program     TEXT PRIMARY KEY,
    username    TEXT NOT NULL,
    rank        INTEGER NOT NULL,
    reputation  INTEGER NOT NULL,
    total       INTEGER NOT NULL,
    checked_at  INTEGER NOT NULL
);
