import React from "react";

const LoadingSkeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-300 ${className}`}
    ></div>
  );
};

export default LoadingSkeleton;
