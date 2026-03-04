import { JobForm } from "@/components/jobs/JobForm";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return (
    <div className="p-6">
      <JobForm defaultStatus={status} />
    </div>
  );
}
