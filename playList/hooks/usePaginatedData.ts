/*import { useState, useEffect, useCallback } from "react";

// Generic hook for paginated data fetching
const usePaginatedData = (fetchFunction: Function, limit: number = 50) => {
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { tracks, total } = await fetchFunction(0, limit);
      setData(tracks);
      setTotal(total);
      setOffset(limit);
    };
    fetchInitialData();
  }, [fetchFunction]);

  // Function to load more data when scrolling
  const fetchData = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const { tracks: newData } = await fetchFunction(offset, limit);
      if (newData.length > 0) {
        setData(prev => [...prev, ...newData]);
        setOffset(prev => prev + limit);
        if (offset + limit >= total) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } finally {
      setIsFetchingMore(false);
    }
  }, [offset, hasMore, isFetchingMore, fetchFunction]);

  return { data, isFetchingMore, hasMore, fetchData };
};

export default usePaginatedData;
*/
import { useState, useEffect, useCallback } from "react";

// Generic hook for paginated data fetching
const usePaginatedData = (fetchFunction: Function, limit: number = 50) => {
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0); // optional, only useful if the API provides total count
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchFunction(0, limit);

      if (Array.isArray(result)) {
        // Apple Music-style result
        setData(result);
        setHasMore(result.length === limit); // assume there's more if we hit the limit
      } else {
        // Spotify-style result
        setData(result.tracks || []);
        setTotal(result.total || 0);
        setHasMore((result.tracks?.length || 0) === limit);
      }

      setOffset(limit);
    };
    fetchInitialData();
  }, [fetchFunction]);

  const fetchData = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);

    try {
      const result = await fetchFunction(offset, limit);

      if (Array.isArray(result)) {
        // Apple Music-style
        setData(prev => [...prev, ...result]);
        setHasMore(result.length === limit);
      } else {
        // Spotify-style
        const newTracks = result.tracks || [];
        setData(prev => [...prev, ...newTracks]);
        setTotal(result.total || 0);
        setHasMore(offset + limit < result.total);
      }

      setOffset(prev => prev + limit);
    } finally {
      setIsFetchingMore(false);
    }
  }, [offset, hasMore, isFetchingMore, fetchFunction, limit]);

  return {
    data: data || [],
    isFetchingMore,
    hasMore,
    fetchData,
  };
};

export default usePaginatedData;