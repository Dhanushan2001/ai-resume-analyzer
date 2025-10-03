import React from "react";

type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let bgClass: string;
  let textClass: string;
  let label: string;

  if (score > 70) {
    bgClass = "bg-badge-green";
    textClass = "text-green-600";
    label = "Strong";
  } else if (score > 49) {
    bgClass = "bg-badge-yellow";
    textClass = "text-yellow-600";
    label = "Good Start";
  } else {
    bgClass = "bg-badge-red";
    textClass = "text-red-600";
    label = "Needs Work";
  }

  return (
    <div className={`inline-flex items-center rounded-full px-3 py-1 ${bgClass}`}>
      <p className={`text-xs font-medium ${textClass}`}>{label}</p>
    </div>
  );
};

export default ScoreBadge;
