export type JobStatus =
  | "wishlist"
  | "applied"
  | "phone_screen"
  | "technical_interview"
  | "final_interview"
  | "offer"
  | "rejected";

export type WorkType = "remote" | "hybrid" | "onsite";
export type Priority = "low" | "medium" | "high";

export interface Job {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: JobStatus;
  url?: string | null;
  location?: string | null;
  workType: WorkType;
  salaryMin?: number | null;
  salaryMax?: number | null;
  priority: Priority;
  appliedAt?: string | Date | null;
  nextInterviewAt?: string | Date | null;
  jobDescription?: string | null;
  notes?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactRole?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

export const JOB_STATUSES: { value: JobStatus; label: string; color: string }[] = [
  { value: "wishlist", label: "Wishlist", color: "gray" },
  { value: "applied", label: "Applied", color: "blue" },
  { value: "phone_screen", label: "Phone Screen", color: "yellow" },
  { value: "technical_interview", label: "Technical Interview", color: "orange" },
  { value: "final_interview", label: "Final Interview", color: "purple" },
  { value: "offer", label: "Offer", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
];

export const WORK_TYPES: { value: WorkType; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
