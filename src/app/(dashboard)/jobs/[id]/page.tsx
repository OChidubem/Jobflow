import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Job } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, formatSalary } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ExternalLink,
  User,
  Mail,
  Phone,
  FileText,
  MessageSquare,
} from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const job = await prisma.job.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!job) notFound();

  const typedJob = job as unknown as Job;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{typedJob.position}</h2>
            <p className="text-gray-500">{typedJob.company}</p>
          </div>
        </div>
        <Link
          href={`/jobs/${job.id}/edit`}
          className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="space-y-4">
        {/* Status & Priority */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={typedJob.status} />
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              typedJob.priority === "high" ? "bg-red-100 text-red-700" :
              typedJob.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {typedJob.priority} priority
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {typedJob.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{typedJob.location}</span>
              </div>
            )}
            {typedJob.workType && (
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 capitalize">{typedJob.workType}</span>
              </div>
            )}
            {(typedJob.salaryMin || typedJob.salaryMax) && (
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{formatSalary(typedJob.salaryMin, typedJob.salaryMax)}</span>
              </div>
            )}
            {typedJob.appliedAt && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Applied {formatDate(typedJob.appliedAt)}</span>
              </div>
            )}
            {typedJob.nextInterviewAt && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span className="text-gray-600">Interview {formatDate(typedJob.nextInterviewAt)}</span>
              </div>
            )}
            {typedJob.url && (
              <div className="flex items-center gap-3 text-sm">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <a
                  href={typedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 truncate"
                >
                  Job Posting
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        {(typedJob.contactName || typedJob.contactEmail || typedJob.contactPhone) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-2">
              {typedJob.contactName && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {typedJob.contactName}
                    {typedJob.contactRole && <span className="text-gray-400"> ({typedJob.contactRole})</span>}
                  </span>
                </div>
              )}
              {typedJob.contactEmail && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${typedJob.contactEmail}`} className="text-indigo-600 hover:text-indigo-700">
                    {typedJob.contactEmail}
                  </a>
                </div>
              )}
              {typedJob.contactPhone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${typedJob.contactPhone}`} className="text-gray-600">
                    {typedJob.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Description */}
        {typedJob.jobDescription && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              Job Description
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {typedJob.jobDescription}
            </p>
          </div>
        )}

        {/* Notes */}
        {typedJob.notes && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              My Notes
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {typedJob.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
