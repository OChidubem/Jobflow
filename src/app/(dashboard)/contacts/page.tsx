import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Mail, Phone, User, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ContactsPage() {
  const session = await getServerSession(authOptions);

  const jobs = await prisma.job.findMany({
    where: {
      userId: session!.user.id,
      NOT: { contactName: null },
    },
    orderBy: { updatedAt: "desc" },
  });

  const contacts = jobs.filter((j) => j.contactName);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
        <p className="text-gray-500 mt-1">
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} from your applications
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No contacts yet</p>
          <p className="text-gray-400 text-sm mt-1">Add contacts when creating job applications</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                    {job.contactName!.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{job.contactName}</p>
                    {job.contactRole && (
                      <p className="text-xs text-gray-500">{job.contactRole}</p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Building2 className="h-3 w-3" />
                <span>{job.company}</span>
              </div>

              {job.contactEmail && (
                <div className="flex items-center gap-2 text-xs mb-1.5">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <a
                    href={`mailto:${job.contactEmail}`}
                    className="text-indigo-600 hover:text-indigo-700 truncate"
                  >
                    {job.contactEmail}
                  </a>
                </div>
              )}

              {job.contactPhone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <a href={`tel:${job.contactPhone}`} className="text-gray-600">
                    {job.contactPhone}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
