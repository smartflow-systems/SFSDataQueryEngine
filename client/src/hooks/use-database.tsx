import { useQuery } from "@tanstack/react-query";
import type { Database } from "@shared/schema";

export function useDatabases() {
  return useQuery<Database[]>({
    queryKey: ["/api/databases"],
  });
}

export function useDatabase(id: string) {
  return useQuery<Database>({
    queryKey: ["/api/databases", id],
    enabled: !!id,
  });
}

export function useDatabaseSchema(id: string) {
  return useQuery({
    queryKey: ["/api/databases", id, "schema"],
    enabled: !!id,
  });
}
