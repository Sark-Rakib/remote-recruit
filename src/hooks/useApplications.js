import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import useDebouncedValue from "./useDebouncedValue";

export default function useApplications({ jobId, token, pageSize = 10 } = {}) {
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sort: "latest",
    page: 1,
  });
  const search = useDebouncedValue(filters.search, 350);

  const [data, setData] = useState({
    applications: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: true,
    error: "",
  });

  const fetchData = useCallback(async () => {
    setData((d) => ({ ...d, loading: true, error: "" }));
    const params = {
      jobId,
      status: filters.status || undefined,
      sort: filters.sort,
      page: filters.page,
      limit: pageSize,
      search: search.trim() || undefined,
    };
    try {
      const res = await api.getApplications(params, token);
      setData({
        applications: res.applications,
        total: res.total,
        page: res.page,
        pages: res.pages,
        loading: false,
        error: "",
      });
    } catch (err) {
      setData((d) => ({ ...d, loading: false, error: err.message }));
    }
  }, [jobId, token, filters.status, filters.sort, filters.page, pageSize, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const update = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch, ...(patch.page ? {} : { page: 1 }) }));
  }, []);

  return {
    applications: data.applications,
    total: data.total,
    page: data.page,
    pages: data.pages,
    loading: data.loading,
    error: data.error,
    filters,
    update,
    refetch: fetchData,
  };
}
