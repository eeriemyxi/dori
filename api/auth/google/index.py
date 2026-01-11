import os
import secrets
import logging

from ._utils import encrypt
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from yarl import URL

IS_PRODUCTION = os.environ.get("VERCEL_ENV") == "production"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

log = logging.getLogger(__name__)
log.setLevel("INFO" if IS_PRODUCTION else "DEBUG")
app = FastAPI()

@app.get("/api/auth/google")
async def root():
    base_url = URL("https://accounts.google.com/o/oauth2/v2/auth")

    code_verifier = secrets.token_urlsafe(32)
    code_challenge = encrypt(code_verifier)
    state_code = secrets.token_urlsafe(32)
    log.debug(f"{code_verifier=} {state_code=} {code_challenge=}")

    params = dict(
        client_id=os.environ["GOOGLE_CLIENT_ID"],
        redirect_uri=os.environ["GOOGLE_REDIRECT_URI"],
        response_type="code",
        access_type="offline",
        prompt="consent",
        scope="openid https://www.googleapis.com/auth/drive.appdata",
        code_challenge=code_challenge,
        code_challenge_method="S256",
        state=state_code,
    )

    final_url = base_url % params
    log.debug(f"{final_url=}")

    response = RedirectResponse(str(final_url))

    response.set_cookie(
        key="google_code_verifier", 
        value=code_verifier, 
        httponly=True,
        secure=IS_PRODUCTION,
        max_age=600,
        path="/"
    )
    
    response.set_cookie(
        key="google_oauth_state", 
        value=state_code, 
        httponly=True, 
        secure=IS_PRODUCTION, 
        max_age=600,
        path="/"
    )
    
    return response
