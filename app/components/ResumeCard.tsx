import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(true);

    useEffect(() => {
        const loadResume = async () => {
            try {
                if (!imagePath) {
                    setIsLoadingImage(false);
                    return;
                }

                const blob = await fs.read(imagePath);
                if(blob) {
                    let url = URL.createObjectURL(blob);
                    setResumeUrl(url);
                }
            } catch (err) {
                console.error("Failed to load resume image", err);
            } finally {
                setIsLoadingImage(false);
            }
        }

        loadResume();
    }, [imagePath, id]);

    // Generate a consistent gradient color based on the company name
    const getGradientClasses = () => {
        const charCode = (companyName || "Resume").charCodeAt(0);
        const gradients = [
            "from-indigo-500 to-purple-500",
            "from-blue-500 to-cyan-500",
            "from-emerald-500 to-teal-500",
            "from-rose-500 to-pink-500",
            "from-violet-500 to-fuchsia-500",
            "from-orange-500 to-amber-500"
        ];
        return gradients[charCode % gradients.length];
    };

    return (
        <Link to={`/resume/${id}`} className="group relative flex flex-col gap-6 bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-[500px]">
            <div className="resume-card-header !min-h-0 shrink-0">
                <div className="flex flex-col gap-1">
                    {companyName ? (
                        <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors break-words">{companyName}</h2>
                    ) : (
                        <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors break-words">Resume Analysis</h2>
                    )}
                    {jobTitle && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest truncate">{jobTitle}</h3>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback?.overallScore || 0} />
                </div>
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 w-full group/image">
                {isLoadingImage ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 animate-pulse">
                        <div className="h-8 w-8 border-4 border-slate-300 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Preview</p>
                    </div>
                ) : resumeUrl ? (
                    <>
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/0 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex items-end justify-center pb-6">
                            <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover/image:translate-y-0 transition-transform">
                                View Analysis
                            </span>
                        </div>
                    </>
                ) : (
                    /* Dynamic Premium Fallback */
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${getGradientClasses()} relative overflow-hidden`}>
                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-xl group-hover/image:scale-110 transition-transform duration-500">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <span className="font-bold tracking-widest text-sm uppercase text-white/90 drop-shadow-md">Verified Document</span>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex items-end justify-center pb-6">
                            <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover/image:translate-y-0 transition-transform">
                                View Analysis
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default ResumeCard;
