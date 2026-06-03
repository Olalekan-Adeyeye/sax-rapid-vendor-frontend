import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean;
}

export function Skeleton({
  circle = false,
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-gray-50 ${circle ? "rounded-full" : "rounded"} ${className}`}
      {...props}
    />
  );
}
