import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const jobSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  status: z.string().default("wishlist"),
  url: z.string().url().optional().nullable().or(z.literal("")),
  location: z.string().optional().nullable(),
  workType: z.string().default("onsite"),
  salaryMin: z.number().optional().nullable(),
  salaryMax: z.number().optional().nullable(),
  priority: z.string().default("medium"),
  appliedAt: z.string().optional().nullable(),
  nextInterviewAt: z.string().optional().nullable(),
  jobDescription: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactRole: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { company: { contains: search } },
        { position: { contains: search } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = jobSchema.parse(body);

    const job = await prisma.job.create({
      data: {
        ...data,
        url: data.url || null,
        userId: session.user.id,
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
        nextInterviewAt: data.nextInterviewAt ? new Date(data.nextInterviewAt) : null,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
