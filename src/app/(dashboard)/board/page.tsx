import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { Job } from "@/types";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function BoardPage() {
  const session = await getServerSession(authOptions);

  const jobs = await prisma.job.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kanban Board</h2>
          <p className="text-gray-500 mt-1">Drag cards to update status</p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </Link>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialJobs={jobs as Job[]} />
      </div>
    </div>
  );
}
