import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JobStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "—";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  if (max) return `Up to ${fmt(max)}`;
  return "—";
}

export const STATUS_COLORS: Record<JobStatus, string> = {
  wishlist: "bg-gray-100 text-gray-700",
  applied: "bg-blue-100 text-blue-700",
  phone_screen: "bg-yellow-100 text-yellow-700",
  technical_interview: "bg-orange-100 text-orange-700",
  final_interview: "bg-purple-100 text-purple-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export const STATUS_LABELS: Record<JobStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  phone_screen: "Phone Screen",
  technical_interview: "Technical Interview",
  final_interview: "Final Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const COLUMN_COLORS: Record<JobStatus, string> = {
  wishlist: "border-gray-300",
  applied: "border-blue-400",
  phone_screen: "border-yellow-400",
  technical_interview: "border-orange-400",
  final_interview: "border-purple-400",
  offer: "border-green-400",
  rejected: "border-red-400",
};
