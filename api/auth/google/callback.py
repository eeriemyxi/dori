import os
import secrets
import logging
import libsql
import traceback
import sys

from ._utils import encrypt, extract_google_sub

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from yarl import URL
import requests

IS_PRODUCTION = os.environ.get("VERCEL_ENV") == "production"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

log = logging.getLogger(__name__)
log.setLevel("INFO" if IS_PRODUCTION else "DEBUG")

app = FastAPI()

def fetch_google_user(access_token: str) -> dict:
    resp = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        timeout=10
    )
    resp.raise_for_status()
    return resp.json()

@app.get("/api/auth/google/callback")
async def root(request: Request):
    code_verifier = request.cookies.get("google_code_verifier")
    oauth_state = request.cookies.get("google_oauth_state")
    
    log.info(f"{request.query_params=}")
    log.info(f"{code_verifier=} {oauth_state=}")

    if not code_verifier:
        raise HTTPException(status_code=400, detail="Verifier cookie missing or expired")

    if not oauth_state:
        raise HTTPException(status_code=400, detail="Oauth state missing or expired")
    
    if encrypt(request.query_params.get("state", "")) != encrypt(oauth_state):
        raise HTTPException(status_code=400, detail="Received Oauth state is invalid")

    try:
        res = requests.post("https://oauth2.googleapis.com/token", json=dict(
          client_id=os.environ["GOOGLE_CLIENT_ID"],
          client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
          grant_type="authorization_code",
          code=request.query_params["code"],
          redirect_uri=os.environ["GOOGLE_REDIRECT_URI"],
          code_verifier=code_verifier
        ))

        log.info(f"{res=} {res.status_code=} {res.text=}")

        data = res.json()
        log.debug(f"Data: {data=}")

        if res.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Couldn't get tokens: {data}")
        
        user_info = fetch_google_user(data['access_token'])
        log.debug(f"User Info: {user_info=}")

        # with libsql.connect(os.environ["TURSO_DATABASE_URL"], auth_token=os.environ["TURSO_DATABASE_TOKEN"]) as client:
            # client.execute("INSERT INTO users (username) VALUES (?)", ["test"])

        return RedirectResponse("/")
    except Exception:
        print("FULL TRACEBACK:")
        traceback.print_exc(file=sys.stdout)
        raise
