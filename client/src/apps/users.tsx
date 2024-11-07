import { UserHeader } from "@/components/users/user-header";
import { UserTable } from "@/components/users/user-table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userList } from "./user-list";

export type userType = {
  uid: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: [string];
  status?: string;
  isLocked: boolean;
};

export const UserList = () => {
  const [data, setData] = useState<userType[]>([]);
  const [filter, setFilter] = useState("");

  // Pagination code
  let { pageno } = useParams();
  const [currPage, setCurrPage] = useState(pageno);

  useEffect(() => {
    setData(userList);
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-2">
      <UserHeader pageno={pageno} filter={filter} setFilter={setFilter} />
      <UserTable userList={data} />
    </div>
  );
};
