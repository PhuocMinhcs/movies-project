import { useRouteError } from "react-router-dom";
import { useMemo } from "react";

const ErrorBoundary = () => {
  let error = useRouteError() as any;

  const message = useMemo(
    () =>
      error?.response
        ? error?.response?.message
        : error?.message || "Unknow error",
    [error]
  );

  return (
    <div className="error-boundary">
      <h1>An error occurred</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorBoundary;
