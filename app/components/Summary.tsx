import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { cn } from "~/lib/utils";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-emerald-500'
            : score > 49
        ? 'text-amber-500' : 'text-rose-500';

    return (
        <div className="flex flex-row justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors duration-300 rounded-xl group border border-transparent hover:border-slate-100">
            <div className="flex flex-row gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-slate-100/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ScoreBadge score={score} />
                </div>
                <p className="text-xl font-medium text-slate-800">{title}</p>
            </div>
            <p className="text-2xl font-bold tracking-tight">
                <span className={cn("transition-colors duration-300", textColor)}>{score}</span>
                <span className="text-slate-300 text-lg ml-1">/100</span>
            </p>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full overflow-hidden relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex flex-col md:flex-row items-center p-8 gap-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-xl scale-110"></div>
                    <ScoreGauge score={feedback.overallScore} />
                </div>

                <div className="flex flex-col gap-3 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">Your Resume Score</h2>
                    <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                        This AI-powered score reflects an in-depth analysis across four crucial industry metrics.
                    </p>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-1">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary
