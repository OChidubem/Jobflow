from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationStatus, ApplicationUpdate


def create_application(db: Session, user_id: str, data: ApplicationCreate) -> Application:
    app_obj = Application(
        user_id=user_id,
        company=data.company,
        role=data.role,
        status=data.status,
        applied_date=data.applied_date,
        url=data.url,
        source=data.source,
        notes=data.notes,
    )
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj


def get_user_applications(
    db: Session,
    user_id: str,
    status: Optional[ApplicationStatus] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> list[Application]:
    q = db.query(Application).filter(Application.user_id == user_id)
    if status:
        q = q.filter(Application.status == status)
    if search:
        term = f"%{search}%"
        q = q.filter(
            or_(Application.company.ilike(term), Application.role.ilike(term))
        )
    return q.order_by(Application.created_at.desc()).offset(skip).limit(limit).all()


def get_user_application_by_id(db: Session, user_id: str, app_id: int) -> Application | None:
    return (
        db.query(Application)
        .filter(Application.id == app_id, Application.user_id == user_id)
        .first()
    )


def update_application(db: Session, app_obj: Application, data: ApplicationUpdate) -> Application:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(app_obj, field, value)
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj


def delete_application(db: Session, app_obj: Application) -> None:
    db.delete(app_obj)
    db.commit()
