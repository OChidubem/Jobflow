import time

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_token
from app.core.redis import redis_client
from app.core.security import verify_password, create_access_token, decode_access_token
from app.crud.users import get_user_by_email, create_user
from app.db.session import get_db
from app.schemas.auth import UserCreate
from app.schemas.token import Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = create_user(db, email=payload.email, password=payload.password)
    return {"id": str(user.id), "email": user.email}


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return {"access_token": create_access_token(subject=str(user.id)), "token_type": "bearer"}


@router.post("/login-json", response_model=Token)
def login_json(payload: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return {"access_token": create_access_token(subject=str(user.id)), "token_type": "bearer"}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(token: str = Depends(get_token)):
    try:
        payload = decode_access_token(token)
        exp = payload.get("exp")
        if exp:
            ttl = int(exp - time.time())
            if ttl > 0:
                redis_client.setex(f"blocklist:{token}", ttl, "1")
    except Exception:
        pass
    return None


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email}
