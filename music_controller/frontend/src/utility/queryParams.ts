import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQueryParams(names: string[]) {
  const { search } = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return names.map((name) => searchParams.get(name));
  }, [names, search]);
}

export function addQueryParam(queryParam: string, paramValue: string) {
  const params = new URLSearchParams(window.location.search);
  params.append(queryParam, paramValue);
  return params.toString();
}

export function removeQueryParam(queryParam: string) {
  const params = new URLSearchParams(window.location.search);
  params.delete(queryParam);
  return params.toString();
}
