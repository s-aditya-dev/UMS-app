import { useMemo, useState } from "react";

export function usePagination<T>(
  rawData: T[],
  recordsPerPage = 5,
  initialPage = 1,
) {
  // use States
  const [data, setData] = useState(rawData);
  const [currPage, setCurrPage] = useState(initialPage);

  // other Variables
  const lastIndex = currPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = useMemo(
    () => data.slice(firstIndex, lastIndex),
    [data, firstIndex, lastIndex],
  );
  const npages = useMemo(
    () => Math.ceil(data.length / recordsPerPage),
    [data, recordsPerPage],
  );
  const recordCounter = `Record Count: ${firstIndex + 1}-${Math.min(lastIndex, data.length)} of ${data.length}`;

  // Event Handlers
  function handleNextPage() {
    if (currPage < npages) {
      const nextPage = currPage + 1;
      setCurrPage(nextPage);
    }
  }
  function handlePreviousPage() {
    if (currPage > 1) {
      const prevPage = currPage - 1;
      setCurrPage(prevPage);
    }
  }
  function handleNthPage(nthPageNumber: number) {
    if (
      nthPageNumber !== currPage &&
      nthPageNumber >= 1 &&
      nthPageNumber <= npages
    ) {
      setCurrPage(nthPageNumber);
    }
  }
  return {
    setPageData: setData,
    currPage,
    setCurrPage,
    records,
    npages,
    firstIndex,
    recordCounter,
    handleNextPage,
    handlePreviousPage,
    handleNthPage,
  };
}
