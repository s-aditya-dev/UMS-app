import { UserHeader } from "@/components/users/user-header";
import { UserTable } from "@/components/users/user-table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userList } from "./user-list";

export type userType = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
};

export const UserList = () => {
  // Hooks
  const navigate = useNavigate();
  const { pageno } = useParams();

  // use States
  const [data, setData] = useState<userType[]>([]);
  const [filter, setFilter] = useState("");
  const [currPage, setCurrPage] = useState(pageno ? parseInt(pageno, 10) : 1);
  console.log(currPage);

  // Pagination code
  const recordsPerPage = 5;
  const lastIndex = currPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = useMemo(
    () => data.slice(firstIndex, lastIndex),
    [data, firstIndex, lastIndex],
  );
  const npages = Math.ceil(data.length / recordsPerPage);

  function handleNextPage() {
    if (currPage < npages) {
      setCurrPage(+currPage + 1);
      navigate(`/panel/users/${+currPage + 1}`);
    }
  }

  function handlePreviousPage() {
    if (currPage > 1) {
      setCurrPage(+currPage - 1);
      navigate(`/panel/users/${+currPage - 1}`);
    }
  }

  function handleNthPage(nthPageNumber: number) {
    if (
      nthPageNumber !== currPage &&
      nthPageNumber >= 1 &&
      nthPageNumber <= npages
    ) {
      setCurrPage(nthPageNumber);
      navigate(`/panel/users/${nthPageNumber}`);
    }
  }

  //use Effects
  useEffect(() => {
    setData(userList);
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-2">
      <UserHeader
        nthClick={handleNthPage}
        prevClick={handlePreviousPage}
        nextClick={handleNextPage}
        currPage={currPage}
        nPage={npages}
        filter={filter}
        setFilter={setFilter}
      />
      <UserTable userList={records} firstIndex={firstIndex} />
    </div>
  );
};
