import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { JobForm } from "@/components/jobs/JobForm";
import { Job } from "@/types";

export default async function EditJobPage({
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

  return (
    <div className="p-6">
      <JobForm job={job as unknown as Job} />
    </div>
  );
}
