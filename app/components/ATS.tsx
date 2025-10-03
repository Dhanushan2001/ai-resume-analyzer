import React from "react";

export type AtsSuggestion = {
  type: "good" | "improve";
  tip: string;
};

type ATSProps = {
  score: number; // 0-100
  suggestions: AtsSuggestion[];
};

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Gradient background based on score
  const fromColor = score > 69 ? "from-green-100" : score > 49 ? "from-yellow-100" : "from-red-100";

  // Icon based on score
  const scoreIcon = score > 69 ? "/icons/ats-good.svg" : score > 49 ? "/icons/ats-warning.svg" : "/icons/ats-bad.svg";

  return (
    <div className={`w-full rounded-2xl p-5 bg-gradient-to-br ${fromColor} to-white`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-3">
        <img src={scoreIcon} alt="ATS status" className="h-8 w-8" />
        <h3 className="text-xl font-semibold">ATS Score - {score}/100</h3>
      </div>

      {/* Description section */}
      <div className="mt-3 flex flex-col gap-2">
        <h4 className="text-sm font-medium text-gray-700">Applicant Tracking System insights</h4>
        <p className="text-sm text-gray-500">
          This section highlights how your resume may be interpreted by automated systems and suggests quick wins to improve parsing and matching.
        </p>

        {/* Suggestions list */}
        <ul className="mt-2 flex flex-col gap-2">
          {suggestions.map((s, idx) => {
            const itemIcon = s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg";
            const itemTextColor = s.type === "good" ? "text-green-700" : "text-yellow-700";
            const itemBg = s.type === "good" ? "bg-green-50" : "bg-yellow-50";
            return (
              <li key={idx} className={`flex items-start gap-2 rounded-md ${itemBg} p-2`}>
                <img src={itemIcon} alt={s.type === "good" ? "Good" : "Improve"} className="mt-0.5 h-4 w-4" />
                <span className={`text-sm ${itemTextColor}`}>{s.tip}</span>
              </li>
            );
          })}
        </ul>

        {/* Closing line */}
        <p className="mt-3 text-sm text-gray-600">
          Keep iterating—small improvements can significantly boost your ATS compatibility.
        </p>
      </div>
    </div>
  );
};

export default ATS;