import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import {DEMO_RESUME} from "~/lib/demo";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // For demo purposes, we don't force login
        // if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            if(id === 'demo') {
                setFeedback(DEMO_RESUME.feedback as Feedback);
                setImageUrl('https://img.freepik.com/free-vector/professional-resume-template-vector-minimalist-design_1017-44941.jpg');
                setResumeUrl('#');
                return;
            }

            let resume = null;
            if (auth.isAuthenticated && auth.user) {
                // Try the scoped key first
                resume = await kv.get(`resume:${auth.user.id}:${id}`);
            }
            
            // Fallback for older resumes or if user is viewing their own but key is different
            if (!resume) {
                resume = await kv.get(`resume:${id}`);
            }

            if(!resume) {
                // Last ditch effort: search for any key ending in this ID
                const search = await kv.list(`resume:*:${id}`, true);
                if (search && search.length > 0) {
                    resume = (search[0] as KVItem).value;
                }
            }

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
        }

        loadResume();
    }, [id, auth.isAuthenticated, auth.user]);

    return (
        <main className="!pt-0 relative overflow-hidden min-h-screen">
            {/* Animated Blobs */}
            <div className="blob blob-1 !opacity-5"></div>
            <div className="blob blob-2 !opacity-5"></div>
            <div className="blob blob-3 !opacity-5"></div>

            <nav className="resume-nav">
                <Link to="/" className="back-button hover:scale-105 transition-transform">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-slate-700 text-sm font-bold uppercase tracking-wider">Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live AI Analysis</span>
                </div>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse relative z-10">
                <section className="feedback-section bg-slate-50/50 backdrop-blur-sm lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] items-center justify-center border-r border-slate-100">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in slide-in-from-left-10 duration-1000 p-6 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/50 rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                                <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors rounded-xl z-10"></div>
                                <img
                                    src={imageUrl}
                                    className="w-full h-full max-h-[70vh] object-contain rounded-xl shadow-inner"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section lg:overflow-y-auto lg:h-[calc(100vh-80px)] custom-scrollbar">
                    <div className="max-w-3xl mx-auto w-full py-8">
                        <div className="mb-10 animate-in fade-in slide-in-from-right-10 duration-1000">
                            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-2">Resume Review</h2>
                            <p className="text-slate-500 font-medium">Deep AI analysis based on your target role.</p>
                        </div>
                        
                        {feedback ? (
                            <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-20">
                                <Summary feedback={feedback} />
                                <div className="grid grid-cols-1 gap-10">
                                    <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                    <Details feedback={feedback} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <img src="/images/resume-scan-2.gif" className="w-[300px]" />
                                <p className="text-xl font-bold text-indigo-600 animate-pulse mt-8">Synthesizing Feedback...</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Resume
