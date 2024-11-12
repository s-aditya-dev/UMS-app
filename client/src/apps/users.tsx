import { UserFooter } from "@/components/users/user-footer";
import { UserHeader } from "@/components/users/user-header";
import { UserTable } from "@/components/users/user-table";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePagination } from "@/hooks/use-pagination";
import { userList } from "./user-list";
import { search } from "@/utils/searchUtils";

export type userType = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob?: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
};

export const UserList = () => {
  // use States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<userType[]>([]);
  const [results, setResults] = useState<userType[]>([]);

  // Hooks
  const { setBreadcrumbs } = useBreadcrumb();
  const { pageno } = useParams();
  const navigate = useNavigate();
  const {
    setPageData,
    currPage,
    setCurrPage,
    records,
    npages,
    firstIndex,
    recordCounter,
    handleNextPage,
    handlePreviousPage,
    handleNthPage,
  } = usePagination(data, 5, pageno ? parseInt(pageno, 10) : 1);

  // Event Handlers
  const navigateToNextPage = () => {
    handleNextPage();
    navigate(`/panel/users/${currPage + 1}`);
  };

  const navigateToPreviousPage = () => {
    handlePreviousPage();
    navigate(`/panel/users/${currPage - 1}`);
  };

  const navigateToNthPage = (nthPageNumber: number) => {
    handleNthPage(nthPageNumber);
    navigate(`/panel/users/${nthPageNumber}`);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const filteredResults = search(data, term, [
        "firstName",
        "lastName",
        "username",
      ]);
      setPageData(filteredResults);
    } else setPageData(data);
    navigateToNthPage(1);
  };

  useEffect(() => {
    const tempData = userList;
    setData(tempData);
    setResults(tempData);
    setPageData(tempData);
    setBreadcrumbs([{ label: "Users" }]);
  }, []);

  useEffect(() => {
    if (!pageno) {
      navigate("1");
      setCurrPage(1);
    }
  }, [pageno]);

  useEffect(() => {
    setResults(records);
  }, [records]);

  return (
    <div className="w-full flex items-center flex-col gap-2">
      <UserHeader
        nthClick={navigateToNthPage}
        prevClick={navigateToPreviousPage}
        nextClick={navigateToNextPage}
        currPage={currPage}
        nPage={npages}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        recordLabel={recordCounter}
      />
      <UserTable userList={results} firstIndex={firstIndex} />
      <UserFooter currPage={currPage} npages={npages} />
    </div>
  );
};
