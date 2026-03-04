import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@jobflow.app" },
    update: {},
    create: {
      name: "Alex Johnson",
      email: "demo@jobflow.app",
      password: hashedPassword,
    },
  });

  const jobs = [
    {
      company: "Google",
      position: "Senior Software Engineer",
      status: "final_interview",
      location: "Mountain View, CA",
      workType: "hybrid",
      salaryMin: 180000,
      salaryMax: 240000,
      priority: "high",
      appliedAt: new Date("2024-01-15"),
      nextInterviewAt: new Date("2024-02-05"),
      notes: "Met the team, great culture fit",
      contactName: "Sarah Kim",
      contactEmail: "sarah.kim@google.com",
      contactRole: "Recruiter",
    },
    {
      company: "Stripe",
      position: "Full Stack Engineer",
      status: "technical_interview",
      location: "San Francisco, CA",
      workType: "remote",
      salaryMin: 160000,
      salaryMax: 200000,
      priority: "high",
      appliedAt: new Date("2024-01-20"),
      contactName: "Mike Chen",
      contactEmail: "mike@stripe.com",
      contactRole: "Hiring Manager",
    },
    {
      company: "Vercel",
      position: "Frontend Engineer",
      status: "applied",
      location: "Remote",
      workType: "remote",
      salaryMin: 140000,
      salaryMax: 180000,
      priority: "medium",
      appliedAt: new Date("2024-01-25"),
      url: "https://vercel.com/careers",
    },
    {
      company: "Shopify",
      position: "Backend Engineer",
      status: "phone_screen",
      location: "Toronto, Canada",
      workType: "hybrid",
      salaryMin: 130000,
      salaryMax: 160000,
      priority: "medium",
      appliedAt: new Date("2024-01-18"),
      contactName: "Emma Wilson",
      contactRole: "Recruiter",
    },
    {
      company: "Netflix",
      position: "Software Engineer II",
      status: "offer",
      location: "Los Gatos, CA",
      workType: "onsite",
      salaryMin: 200000,
      salaryMax: 280000,
      priority: "high",
      appliedAt: new Date("2024-01-10"),
      notes: "Amazing offer! Equity vesting over 4 years.",
      contactName: "Tom Hardy",
      contactEmail: "t.hardy@netflix.com",
      contactRole: "Hiring Manager",
    },
    {
      company: "Meta",
      position: "Software Engineer",
      status: "rejected",
      location: "Menlo Park, CA",
      workType: "onsite",
      salaryMin: 170000,
      salaryMax: 220000,
      priority: "medium",
      appliedAt: new Date("2024-01-05"),
      notes: "Failed the system design round",
    },
    {
      company: "Airbnb",
      position: "React Developer",
      status: "wishlist",
      location: "San Francisco, CA",
      workType: "hybrid",
      salaryMin: 150000,
      salaryMax: 190000,
      priority: "low",
      url: "https://airbnb.com/careers",
    },
    {
      company: "Figma",
      position: "Product Engineer",
      status: "applied",
      location: "Remote",
      workType: "remote",
      salaryMin: 145000,
      salaryMax: 185000,
      priority: "medium",
      appliedAt: new Date("2024-01-28"),
    },
    {
      company: "Linear",
      position: "Software Engineer",
      status: "applied",
      location: "Remote",
      workType: "remote",
      salaryMin: 140000,
      salaryMax: 170000,
      priority: "high",
      appliedAt: new Date("2024-01-30"),
      url: "https://linear.app/careers",
    },
    {
      company: "Notion",
      position: "Senior Frontend Engineer",
      status: "wishlist",
      location: "San Francisco, CA",
      workType: "hybrid",
      salaryMin: 155000,
      salaryMax: 195000,
      priority: "medium",
    },
  ];

  await prisma.job.deleteMany({ where: { userId: user.id } });

  for (const job of jobs) {
    await prisma.job.create({
      data: { ...job, userId: user.id },
    });
  }

  console.log(`✅ Seeded ${jobs.length} jobs for user: ${user.email}`);
  console.log("   Login: demo@jobflow.app / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
