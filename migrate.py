# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "libsql",
#     "python-dotenv",
# ]
# ///

from dotenv import load_dotenv
load_dotenv()

import os
import logging
import libsql

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

MIGRATIONS = [
    (1, "create_users", """
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          google_sub TEXT UNIQUE NOT NULL,
          email TEXT
        );
    """),
    (2, "create_oauth_tokens", """
        CREATE TABLE oauth_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          scopes TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """),
    (3, "enable_foreign_keys", "PRAGMA foreign_keys = ON;")
]

def main():
    with libsql.connect(
        os.environ["TURSO_DATABASE_URL"],
        auth_token=os.environ["TURSO_DATABASE_TOKEN"]
    ) as client:

        client.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              applied_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        """)

        applied = {
            row[0]
            for row in client.execute(
                "SELECT id FROM schema_migrations"
            ).fetchall()
        }

        for mid, name, sql in MIGRATIONS:
            if mid in applied:
                continue

            log.info("Applying migration %s (%s)", mid, name)
            client.execute(sql)
            client.execute(
                "INSERT INTO schema_migrations (id, name) VALUES (?, ?)",
                [mid, name]
            )

        log.info("Migrations complete")

if __name__ == "__main__":
    main()
