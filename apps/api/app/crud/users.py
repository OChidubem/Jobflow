from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def update_password(db: Session, user: User, new_password: str) -> User:
    from app.core.security import hash_password
    user.hashed_password = hash_password(new_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_user(db: Session, email: str, password: str):
    hashed = hash_password(password)

    user = User(
        email=email,
        hashed_password=hashed
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

