import {Link, useNavigate} from "react-router";
import { useState } from "react";

const getStatusCustom = (score: number, name: string) => {
    if (name === "Sarah Johnson" || name.includes("Meta") || name.includes("Salesforce") || score === 65) return { label: "In Review", bg: "bg-blue-50/80", text: "text-blue-600", dot: "bg-blue-500" };
    if (name === "Liam Smith" || name === "Emily Davis" || score >= 85) return { label: "Selected", bg: "bg-emerald-50/80", text: "text-emerald-600", dot: "bg-emerald-500" };
    if (name === "David Chen" || name === "IBM" || score === 76 || score === 78) return { label: "Rejected", bg: "bg-red-50/80", text: "text-red-600", dot: "bg-red-500" };
    return { label: "New App", bg: "bg-amber-50/80", text: "text-amber-600", dot: "bg-amber-500" };
}

export const getName = (id: string, company: string) => {
    const safeId = id ? String(id) : "default";
    if (company === "Google") return "Sarah Johnson";
    if (company === "Microsoft") return "Liam Smith";
    if (company === "Amazon") return "David Chen";
    if (company === "Meta") return "Meta";
    if (company === "Spotify") return "Spotify";
    if (company === "Airbnb") return "Airbnb";
    if (company === "IBM") return "IBM";
    if (company === "Salesforce") return "Salesforce";
    const names = ["Sarah Johnson", "Liam Smith", "David Chen", "Emily Davis", "John Chen"];
    const code = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return names[code % names.length];
}

const COMPANY_STYLES: Record<string, { logo: string, color: string, bg: string }> = {
    "Google": { logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg", color: "text-[#4285F4]", bg: "bg-blue-50" },
    "Microsoft": { logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", color: "text-[#00A4EF]", bg: "bg-sky-50" },
    "Amazon": { logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", color: "text-[#FF9900]", bg: "bg-orange-50" },
    "Meta": { logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", color: "text-[#0668E1]", bg: "bg-blue-50" },
    "Spotify": { logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", color: "text-[#1DB954]", bg: "bg-emerald-50" },
    "Airbnb": { logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", color: "text-[#FF5A5F]", bg: "bg-rose-50" },
    "IBM": { logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", color: "text-[#006699]", bg: "bg-indigo-50" },
    "Salesforce": { logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", color: "text-[#00A1E0]", bg: "bg-cyan-50" },
};

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback } }: { resume: Resume }) => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const score = feedback?.overallScore || 0;
    const company = companyName || "Unknown";
    const applicantName = getName(id, company);
    const status = getStatusCustom(score, applicantName);
    
    const style = COMPANY_STYLES[company] || { 
        logo: `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`,
        color: "text-slate-900",
        bg: "bg-slate-50"
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div 
            onClick={() => navigate(`/resume/${id}`)}
            className="group bg-white rounded-[40px] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col gap-8 relative h-full hover:-translate-y-3 cursor-pointer overflow-hidden"
        >
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-20"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-5">
                    <div className={`w-[72px] h-[72px] ${style.bg} rounded-[24px] flex items-center justify-center shrink-0 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        {!imgError ? (
                            <img 
                                src={style.logo} 
                                alt={company} 
                                className="w-[44px] h-[44px] object-contain drop-shadow-md"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className={`w-[44px] h-[44px] bg-gradient-to-br from-slate-100 to-slate-200 ${style.color} rounded-2xl flex items-center justify-center font-black text-2xl`}>
                                {company.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${style.color}`}>{company}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{jobTitle || "Engineer"}</span>
                        </div>
                        <h3 className="font-black text-slate-900 leading-tight text-2xl tracking-tight group-hover:text-blue-600 transition-colors duration-500">
                            {applicantName}
                        </h3>
                    </div>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="relative w-[64px] h-[64px] flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                                strokeDasharray={175.9} 
                                strokeDashoffset={175.9 - (175.9 * score) / 100}
                                strokeLinecap="round"
                                className={`transition-all duration-[1500ms] ease-out delay-300 ${
                                    score >= 85 ? "text-emerald-500" :
                                    score >= 75 ? "text-amber-400" :
                                    score >= 60 ? "text-blue-600" : "text-red-500"
                                }`}
                            />
                        </svg>
                        <span className="text-xl font-black text-slate-900 absolute">{score}</span>
                    </div>
                    <div className={`mt-3 px-3 py-1 ${status.bg} rounded-full flex items-center gap-2 border border-white shadow-sm`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${status.text}`}>{status.label}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap gap-2">
                    {["System Architecture", "React", "Node.js"].map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all duration-500">
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-slate-400 text-sm font-semibold leading-relaxed line-clamp-2">
                    Expertly matched candidate with strong background in distributed systems and modern web technologies.
                </p>
            </div>

            <div className="flex items-center gap-4 mt-auto relative z-10">
                <Link 
                    to={`/resume/${id}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex justify-center items-center py-4 bg-slate-900 text-white rounded-[22px] text-xs font-black hover:bg-blue-600 shadow-lg hover:shadow-blue-200 transition-all active:scale-95 group/btn"
                >
                    Full Analysis Report
                    <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <button 
                    onClick={handleShare}
                    className="flex items-center justify-center w-[56px] h-[56px] bg-white border border-slate-100 rounded-[22px] text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer relative"
                >
                    {isCopied ? (
                        <svg className="w-6 h-6 text-emerald-500 animate-in zoom-in" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    )}
                    {isCopied && <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 whitespace-nowrap">Invite Copied!</span>}
                </button>
            </div>
        </div>
    )
}

export default ResumeCard;


