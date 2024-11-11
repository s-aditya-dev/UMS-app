import { UserFooter } from "@/components/users/user-footer";
import { UserHeader } from "@/components/users/user-header";
import { UserTable } from "@/components/users/user-table";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userList } from "./user-list";

export type userType = {
  _id?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob?: Date;
  email?: string;
  phone?: number;
  isLocked: boolean;
  permissions?: object;
};

export const UserList = () => {
  // Hooks
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();
  const { pageno } = useParams();

  // use States
  const [data, setData] = useState<userType[]>([]);
  const [filter, setFilter] = useState("");
  const [currPage, setCurrPage] = useState(pageno ? parseInt(pageno, 10) : 1);

  // Pagination code
  const recordsPerPage = 5;
  const lastIndex = currPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = useMemo(
    () => data.slice(firstIndex, lastIndex),
    [data, firstIndex, lastIndex],
  );
  const npages = Math.ceil(data.length / recordsPerPage);

  // Variables
  const recordLabel = `Rocord Count : ${firstIndex + 1}-${lastIndex} of ${data.length}`;

  // Event Handlers
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

  // use Effects
  useEffect(() => {
    setData(userList);
    setBreadcrumbs([{ label: "Users" }]);

    // Sets the default page to 1
    if (!pageno) navigate("1");
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
        recordLabel={recordLabel}
      />
      <UserTable userList={records} firstIndex={firstIndex} />

      <UserFooter currPage={currPage} npages={npages} />
    </div>
  );
};
