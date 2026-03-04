import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Briefcase, TrendingUp, Calendar, Trophy } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ApplicationsChart } from "@/components/dashboard/ApplicationsChart";
import { StatusPieChart } from "@/components/dashboard/StatusPieChart";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, formatSalary } from "@/lib/utils";
import { Job } from "@/types";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const jobs = await prisma.job.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => !["rejected", "offer", "wishlist"].includes(j.status)).length,
    interviews: jobs.filter((j) =>
      ["phone_screen", "technical_interview", "final_interview"].includes(j.status)
    ).length,
    offers: jobs.filter((j) => j.status === "offer").length,
  };

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-500 mt-1">Here&apos;s your job search overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Applications" value={stats.total} icon={Briefcase} color="blue" />
        <StatsCard title="Active Applications" value={stats.active} icon={TrendingUp} color="purple" />
        <StatsCard title="Interviews" value={stats.interviews} icon={Calendar} color="orange" />
        <StatsCard title="Offers" value={stats.offers} icon={Trophy} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicationsChart jobs={jobs as Job[]} />
        </div>
        <div>
          <StatusPieChart jobs={jobs as Job[]} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Recent Applications</h3>
          <Link href="/jobs" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </Link>
        </div>
        {recentJobs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No applications yet</p>
            <Link
              href="/jobs/new"
              className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first application →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-semibold text-sm">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.position}</p>
                    <p className="text-xs text-gray-500">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <StatusBadge status={job.status as Job["status"]} />
                  <span className="text-xs text-gray-400">{formatDate(job.appliedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
