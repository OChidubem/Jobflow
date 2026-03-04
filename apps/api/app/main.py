from fastapi import FastAPI
from app.db.session import test_connection

app = FastAPI(title="Jobflow API", version="0.1.0")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db():
    value = test_connection()
    return {"database": "connected", "result": value}
