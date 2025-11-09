type RawUpdateResultSingle =
  | { affectedRows: number } // MySQL/MariaDB
  | { rowCount: number } // Postgres
  | { affected: number } // TypeORM UpdateResult-ish
  | { changes: number }; // SQLite (better safe than sorry)

// What rawQuery might give you
export type RawUpdateResult = RawUpdateResultSingle | RawUpdateResultSingle[];
