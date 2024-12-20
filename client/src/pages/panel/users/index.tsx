import { UserFooter } from "@/pages/panel/users/user-footer";
import { getUsers } from "@/pages/panel/users/user-func";
import { UserHeader } from "@/pages/panel/users/user-header";
import { UserTable } from "@/pages/panel/users/user-table";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { usePagination } from "@/hooks/use-pagination";
import { search } from "@/utils/searchUtils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UserList = () => {
  // Redux Selector
  const userList = getUsers();

  // use States
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hooks
  const { setBreadcrumbs } = useBreadcrumb();
  const { pageno } = useParams();
  const navigate = useNavigate();
  const PaginationState = usePagination(
    userList,
    5,
    pageno ? parseInt(pageno, 10) : 1,
  );
  const {
    setPageData,
    records,
    handleNextPage,
    handlePreviousPage,
    handleNthPage,
  } = PaginationState;

  // Event Handlers
  const navigateToNextPage = () => {
    handleNextPage();
    navigate(`/panel/users/${PaginationState.currPage + 1}`);
  };

  const navigateToPreviousPage = () => {
    handlePreviousPage();
    navigate(`/panel/users/${PaginationState.currPage - 1}`);
  };

  const navigateToNthPage = (nthPageNumber: number) => {
    handleNthPage(nthPageNumber);
    navigate(`/panel/users/${nthPageNumber}`);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const filteredResults = search(userList, term, [
        "firstName",
        "lastName",
        "username",
      ]);
      setPageData(filteredResults);
    } else setPageData(userList);
    navigateToNthPage(1);
  };

  // use Effects
  useEffect(() => {
    setPageData(userList);
    setBreadcrumbs([{ label: "Users" }]);
  }, [userList]); // Automatically updates when `userList` changes

  useEffect(() => {
    if (!pageno) {
      navigate("1");
      PaginationState.setCurrPage(1);
    }
  }, [pageno]);

  return (
    <div className="w-full flex items-center flex-col gap-2">
      <UserHeader
        nthClick={navigateToNthPage}
        prevClick={navigateToPreviousPage}
        nextClick={navigateToNextPage}
        currPage={PaginationState.currPage}
        nPage={PaginationState.npages}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        recordLabel={PaginationState.recordCounter}
      />
      <UserTable userList={records} firstIndex={PaginationState.firstIndex} />
      <UserFooter
        currPage={PaginationState.currPage}
        npages={PaginationState.npages}
      />
    </div>
  );
};
