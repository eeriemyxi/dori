import hashlib, base64

def extract_google_sub(id_token: str) -> str:
    header, payload, signature = id_token.split(".")
    payload += "=" * (-len(payload) % 4)  # base64 padding
    data = json.loads(base64.urlsafe_b64decode(payload))
    return data["sub"]

def encrypt(text: str) -> str:
    hash_object = hashlib.sha256(text.encode('ascii'))
    return base64.urlsafe_b64encode(hash_object.digest()).decode('ascii').rstrip('=')
