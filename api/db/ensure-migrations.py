import os
import logging
import libsql
from fastapi import FastAPI, Request

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)
app = FastAPI()

@app.get("/api/db/ensure-migrations")
async def root(request: Request):
    try:
        with libsql.connect(os.environ["TURSO_DATABASE_URL"], auth_token=os.environ["TURSO_DATABASE_TOKEN"]) as client:
            client.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT)")
            client.execute("INSERT INTO users (username) VALUES (?)", ["test"])
    except Exception as e:
        log.error(e, exc_info=True)
        return {"error": str(e)}
        
    return "Hello world!"
