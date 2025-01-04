import { LoadingSpinner } from "./loading-spinner";

export const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};