import { useEffect, useState } from "react";

const url = "https://api.mockapi.com/ranges";
const api_key = "cbd3f69cf17e41d7a3de78611059570e";

interface ApiResponse {
  ranges: number[];
}

export const useGetDataRanges = () => {
  const [arrayRanges, setArrayRanges] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          headers: { "X-API-KEY": api_key },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        setArrayRanges(data?.ranges?.sort((a, b) => a - b) || []);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError((err as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  return { arrayRanges, isLoading, error };
};
