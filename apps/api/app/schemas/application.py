from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional


class ApplicationStatus(str, Enum):
    applied = "applied"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"
    withdrawn = "withdrawn"


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: ApplicationStatus = ApplicationStatus.applied
    applied_date: Optional[datetime] = None
    url: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    applied_date: Optional[datetime] = None
    url: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    company: str
    role: str
    status: ApplicationStatus
    applied_date: Optional[datetime] = None
    url: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
