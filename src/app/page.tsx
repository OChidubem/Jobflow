import Link from "next/link";
import { Briefcase, BarChart3, Kanban, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-indigo-300" />
          <span className="text-white text-xl font-bold">Jobflow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-indigo-200 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-800/50 border border-indigo-700 rounded-full px-4 py-1.5 mb-8">
          <span className="text-indigo-300 text-sm font-medium">✨ Track every application, land your dream job</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Never lose track of a<br />
          <span className="text-indigo-300">job application</span> again
        </h1>
        
        <p className="text-indigo-200 text-xl max-w-2xl mx-auto mb-10">
          Jobflow helps you organize, track, and analyze your job search with a beautiful kanban board, 
          analytics dashboard, and detailed application records.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/register"
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-indigo-900/50"
          >
            Start tracking for free
          </Link>
          <Link
            href="/login"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
          >
            Sign in to your account
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Briefcase, title: "Application Tracking", desc: "Keep all your job applications organized in one place" },
            { icon: Kanban, title: "Kanban Board", desc: "Visualize your pipeline with drag-and-drop cards" },
            { icon: BarChart3, title: "Analytics", desc: "Charts and insights about your job search progress" },
            { icon: Users, title: "Contact Manager", desc: "Track recruiters and hiring managers easily" },
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-left">
              <feature.icon className="h-8 w-8 text-indigo-300 mb-3" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-indigo-200 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
