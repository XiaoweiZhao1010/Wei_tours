export default function LoadingSpinner({
  size = "md",
  variant = "default",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };
  const colorClasses =
    variant === "light"
      ? "border-white/30 border-t-white"
      : "border-natours/30 border-t-natours";

  return (
    <div
      className={`animate-spin rounded-full border-solid ${colorClasses} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
