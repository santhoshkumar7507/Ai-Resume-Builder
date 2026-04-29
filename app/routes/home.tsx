import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard, { getName } from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {DEMO_RESUME} from "~/lib/demo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      if (auth.isAuthenticated && auth.user) {
          const userId = auth.user.id;
          const userResumes = (await kv.list(`resume:${userId}:*`, true)) as KVItem[];
          const parsedResumes = userResumes?.map((resume) => (
              JSON.parse(resume.value) as Resume
          )) || [];
          setResumes(parsedResumes);
      } else {
          setResumes([DEMO_RESUME as unknown as Resume]);
      }
      setLoadingResumes(false);
    }
    loadResumes()
  }, [auth.isAuthenticated, auth.user]);

  const filteredResumes = resumes.filter(resume => {
    const applicantName = getName(resume.id, resume.companyName || "");
    const matchesSearch = (resume.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resume.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          applicantName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "All" || 
                         (statusFilter === "Hired" && (resume.feedback?.overallScore || 0) >= 85) ||
                         (statusFilter === "Review" && (resume.feedback?.overallScore || 0) < 85 && (resume.feedback?.overallScore || 0) >= 60);

    return matchesSearch && matchesStatus;
  });

  // Mock expansion for demo if only 1 resume
  const displayResumes = (filteredResumes.length === 1 && searchQuery === "") 
    ? [filteredResumes[0], ...Array.from({length: 11}).map((_, i) => ({
        ...filteredResumes[0], 
        id: `mock-${i}`, 
        feedback: { ...filteredResumes[0].feedback, overallScore: [88, 78, 65, 89, 76, 78, 65, 65, 65, 74, 63][i] }, 
        companyName: ["Microsoft", "Amazon", "Meta", "Spotify", "Airbnb", "IBM", "Salesforce", "Salesforce", "Amazon", "Salesforce", "IBM"][i],
        jobTitle: ["Lead Designer", "Backend Engineer", "Product Manager", "Data Scientist", "UX Researcher", "Cloud Architect", "Frontend Dev", "Security Eng", "Fullstack", "DevOps", "AI Engineer"][i]
      }))] 
    : filteredResumes;

  const stats = {
      total: displayResumes.length,
      avgScore: Math.round(displayResumes.reduce((acc, r) => acc + (r.feedback?.overallScore || 0), 0) / (displayResumes.length || 1)),
      hired: displayResumes.filter(r => (r.feedback?.overallScore || 0) >= 85).length,
      topSkill: "System Design"
  };

  return <main className="relative bg-[#f8fafc] dark:bg-[#020617] min-h-screen pt-0 transition-colors duration-500">
    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 dark:from-blue-900/10 to-transparent pointer-events-none transition-colors duration-500"></div>
    <div className="absolute top-40 right-40 w-[500px] h-[500px] bg-indigo-100/20 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

    <Navbar />

    <section className="relative z-10 w-full pt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-10 w-full">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
          <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                      {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="" />)}
                  </div>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest ml-2">Active Recruiter Community</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 bg-none [-webkit-text-fill-color:initial]">Talent Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg leading-relaxed">
                Welcome back! You have <span className="text-blue-600 dark:text-blue-400 font-black">{stats.total}</span> candidates to review today across <span className="text-slate-900 dark:text-slate-200 font-black">4 active</span> departments.
              </p>
          </div>

          <div className="flex items-center gap-4">
              <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[22px] border border-slate-100 dark:border-slate-800 shadow-sm">
                  {["All", "Hired", "Review"].map((status) => (
                      <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-2.5 rounded-[16px] text-xs font-black transition-all cursor-pointer ${statusFilter === status ? "bg-slate-900 dark:bg-blue-600 text-white shadow-lg" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                          {status}
                      </button>
                  ))}
              </div>
              <Link to="/upload" className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[22px] text-sm font-black shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-95 group">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  Analyze New Resume
              </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
                { label: "Total Applications", value: stats.total, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: "blue" },
                { label: "Average ATS Score", value: stats.avgScore, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, color: "indigo" },
                { label: "High Quality Matches", value: stats.hired, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "emerald" },
                { label: "Trending Skill", value: stats.topSkill, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, color: "amber" },
            ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md dark:shadow-none transition-all duration-500">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}{stat.label.includes("Score") ? "%" : ""}</h3>
                    </div>
                    <div className={`w-14 h-14 bg-${stat.color}-50 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[32px] border border-white dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 w-full group">
                <svg className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Search by name, position, or company..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-transparent rounded-[24px] text-base font-bold focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white" 
                />
            </div>
            <div className="flex items-center gap-3 pr-2">
                <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-500 hover:text-slate-900 shadow-sm hover:shadow transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Advanced Filters
                </button>
            </div>
        </div>

        {loadingResumes ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-500 font-bold mt-6 tracking-tight">Syncing application data...</p>
            </div>
        ) : displayResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {displayResumes.map((resume, idx) => (
                <ResumeCard key={resume.id || `fallback-${idx}`} resume={resume as Resume} />
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No matching applicants</h3>
                <p className="text-slate-500 font-medium mb-8">Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={() => {setSearchQuery(""); setStatusFilter("All")}} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer">
                    Clear all filters
                </button>
            </div>
        )}
      </div>
    </section>
  </main>
}

