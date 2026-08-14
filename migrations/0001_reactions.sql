-- Reacciones de las entradas.
--
-- `entry` es la ruta publicada (/es/blog/<slug>), no el nombre del archivo:
-- es lo que ve el navegador y lo que el worker puede verificar contra dist/.

CREATE TABLE IF NOT EXISTS reaction_counts (
    entry TEXT    NOT NULL,
    kind  TEXT    NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (entry, kind)
);

-- Un voto por persona y entrada. `voter` es un hash con sal de IP + user agent:
-- aquí no se guarda ningún dato personal en claro.
CREATE TABLE IF NOT EXISTS reaction_votes (
    entry      TEXT    NOT NULL,
    voter      TEXT    NOT NULL,
    kind       TEXT    NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (entry, voter)
);
