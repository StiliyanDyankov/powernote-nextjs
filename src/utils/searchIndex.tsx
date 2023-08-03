"use client"
import { Document } from "flexsearch";
import { useCallback, useMemo, useState } from "react";

const useFlexSearch = (options = {}) => {
  const [query, updateQuery] = useState("");

  
    for (const question of peerlessSchoolarData) {
      index.add(question);
    }
    // peerlessSchoolarData.forEach((item) => index.add(item));

    return index;
  }, []);

  const result = useMemo(
    () => document.search(query, { pluck: "q", limit, enrich: true }),
    [query, document, limit]
  );

  const setQuery = useMemo(() => debounce(20, updateQuery), []);
  const onSearch = useCallback((e) => setQuery(e.target.value), [setQuery]);

  return {
    result,
    query,
    setQuery,
    onSearch,
  };
};

export default useFlexSearch;
