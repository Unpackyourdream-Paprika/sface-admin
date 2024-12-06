import { useState } from "react";
import { fetchClient } from "@/lib/fetchClient";

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleRequest = async <T>(
    request: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await request();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get: <T>(url: string) => handleRequest<T>(() => fetchClient.get(url)),
    post: <T>(url: string, body: any) =>
      handleRequest<T>(() => fetchClient.post(url, body)),
    put: <T>(url: string, body: any) =>
      handleRequest<T>(() => fetchClient.put(url, body)),
    delete: <T>(url: string) => handleRequest<T>(() => fetchClient.delete(url)),
  };
}
