import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row justify-between w-full items-center py-4 px-2">
        <p className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 items-center w-full mt-2 mb-4">
        {/* Quick summary grid */}
        <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 w-full rounded-2xl px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5 shadow-sm">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-3 items-start" key={index}>
                <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${tip.type === "good" ? "bg-emerald-100" : "bg-amber-100"}`}>
                  <img
                      src={
                        tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                      }
                      alt="score"
                      className="size-4"
                  />
                </div>
                <p className="text-lg font-medium text-slate-600 leading-snug">{tip.tip}</p>
              </div>
          ))}
        </div>
        
        {/* Detailed explanations */}
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300 hover:shadow-md border",
                      tip.type === "good"
                          ? "bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 border-emerald-100 text-emerald-900"
                          : "bg-gradient-to-br from-amber-50/80 to-amber-50/30 border-amber-100 text-amber-900"
                  )}
              >
                <div className="flex flex-row gap-3 items-center">
                  <div className={`p-1.5 rounded-full ${tip.type === "good" ? "bg-emerald-200/50" : "bg-amber-200/50"}`}>
                    <img
                        src={
                          tip.type === "good"
                              ? "/icons/check.svg"
                              : "/icons/warning.svg"
                        }
                        alt="score"
                        className="size-5"
                    />
                  </div>
                  <p className="text-xl font-bold tracking-tight">{tip.tip}</p>
                </div>
                <p className="text-slate-700 leading-relaxed ml-11">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 mb-12">
        <h3 className="text-2xl font-extrabold mb-2 px-2 text-slate-800">Detailed Analysis</h3>
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;
