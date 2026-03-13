from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_current_user
from app.crud.applications import (
    create_application,
    get_user_applications,
    get_user_application_by_id,
    update_application,
    delete_application,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationStatus,
    ApplicationUpdate,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_app(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_application(db, user.id, payload)


@router.get("", response_model=list[ApplicationOut])
def list_apps(
    filter_status: Optional[ApplicationStatus] = Query(None, alias="status"),
    search: Optional[str] = Query(None, description="Search by company or role"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_user_applications(
        db, user.id, status=filter_status, search=search, skip=skip, limit=limit
    )


@router.get("/{app_id}", response_model=ApplicationOut)
def get_app(
    app_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    app_obj = get_user_application_by_id(db, user.id, app_id)
    if not app_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app_obj


@router.patch("/{app_id}", response_model=ApplicationOut)
def patch_app(
    app_id: int,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    app_obj = get_user_application_by_id(db, user.id, app_id)
    if not app_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return update_application(db, app_obj, payload)


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_app(
    app_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    app_obj = get_user_application_by_id(db, user.id, app_id)
    if not app_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    delete_application(db, app_obj)
    return None
