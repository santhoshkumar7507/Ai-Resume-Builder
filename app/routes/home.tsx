import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
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

  useEffect(() => {
    // For demo purposes, we don't force login on the home page
    // if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      // Only list resumes if authenticated, otherwise just show demo
      if (auth.isAuthenticated && auth.user) {
          const userId = auth.user.id;
          const userResumes = (await kv.list(`resume:${userId}:*`, true)) as KVItem[];
          
          const parsedResumes = userResumes?.map((resume) => (
              JSON.parse(resume.value) as Resume
          )) || [];

          setResumes(parsedResumes);
      } else {
          // For non-authenticated users, only show the demo resume to protect privacy
          setResumes([DEMO_RESUME as unknown as Resume]);
      }
      
      setLoadingResumes(false);
    }

    loadResumes()
  }, [auth.isAuthenticated, auth.user]);

  return <main className="relative overflow-hidden">
    {/* Animated Blobs */}
    <div className="blob blob-1"></div>
    <div className="blob blob-2"></div>
    <div className="blob blob-3"></div>

    <Navbar />

    <section className="main-section relative z-10">
      <div className="page-heading py-20">
        <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Track Your Applications & <br />
            <span className="text-indigo-600">Resume Ratings</span>
        </h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2 className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 text-slate-500 font-medium">Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-20">
            <img src="/images/resume-scan-2.gif" className="w-[240px] opacity-80" />
            <p className="text-slate-400 font-medium mt-4">Scanning your history...</p>
          </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link to="/upload" className="primary-button w-fit text-2xl px-12 py-5 font-bold shadow-2xl hover:scale-110 transition-all">
              Upload Your First Resume
            </Link>
            <p className="text-slate-400">Join thousands of job seekers improving their odds.</p>
          </div>
      )}
    </section>
  </main>
}
