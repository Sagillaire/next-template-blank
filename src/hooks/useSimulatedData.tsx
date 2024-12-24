import { useEffect, useState } from "react";

interface SimulatedResponse {
  min: number;
  max: number;
}

export const useSimulatedData = ({
  min = 1,
  max = 500,
}: Partial<SimulatedResponse>) => {
  const [range, setRange] = useState<SimulatedResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const simulateFetch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (controller.signal.aborted) return;

        const data: SimulatedResponse = { min, max };

        setRange(data);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError((err as Error).message || "Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    simulateFetch();

    return () => controller.abort();
  }, []);

  return { range, isLoading, error };
};
