import { useQuery } from "@tanstack/react-query";
import type { Query } from "@shared/schema";

interface UseQueriesOptions {
  saved?: boolean;
  recent?: boolean;
  limit?: number;
}

export function useQueries(options: UseQueriesOptions = {}) {
  const { saved, recent, limit } = options;
  
  let endpoint = "/api/queries";
  const queryParams = new URLSearchParams();
  
  if (saved) {
    endpoint = "/api/queries/saved";
  } else if (recent) {
    endpoint = "/api/queries/recent";
    if (limit) {
      queryParams.set("limit", limit.toString());
    }
  }
  
  const queryString = queryParams.toString();
  const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return useQuery<Query[]>({
    queryKey: [finalEndpoint],
  });
}

export function useQueryById(id: string) {
  return useQuery<Query>({
    queryKey: ["/api/queries", id],
    enabled: !!id,
  });
}
