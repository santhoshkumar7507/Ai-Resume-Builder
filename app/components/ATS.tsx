import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass = score > 69
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
    <div className={`relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full p-8 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]`}>
      {/* Decorative gradient overlay */}
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${gradientClass} to-transparent opacity-50 pointer-events-none`}></div>

      {/* Top section with icon and headline */}
      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className={`p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex-shrink-0 ${score > 69 ? 'shadow-green-100' : score > 49 ? 'shadow-yellow-100' : 'shadow-red-100'}`}>
            <img src={iconSrc} alt="ATS Score Icon" className="w-10 h-10 transform hover:scale-110 transition-transform duration-300" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">ATS Score: {score}<span className="text-xl text-slate-400">/100</span></h2>
          <p className={`font-medium mt-1 ${score > 69 ? 'text-emerald-600' : score > 49 ? 'text-amber-600' : 'text-rose-600'}`}>{subtitle}</p>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-8 relative z-10">
        <p className="text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by leading employers.
        </p>

        {/* Suggestions list */}
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-sm ${suggestion.type === "good" ? "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200" : "bg-amber-50/50 border-amber-100 hover:border-amber-200"}`}>
              <div className={`p-1.5 rounded-full mt-0.5 ${suggestion.type === "good" ? "bg-emerald-100" : "bg-amber-100"}`}>
                <img
                  src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt={suggestion.type === "good" ? "Check" : "Warning"}
                  className="w-4 h-4"
                />
              </div>
              <p className={`text-lg ${suggestion.type === "good" ? "text-emerald-800" : "text-amber-800"}`}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
          <p className="text-slate-500 italic text-sm font-medium text-center">
            Keep refining your resume to improve your chances of getting past ATS filters and into the hands of top-tier recruiters.
          </p>
      </div>
    </div>
  )
}

export default ATS
