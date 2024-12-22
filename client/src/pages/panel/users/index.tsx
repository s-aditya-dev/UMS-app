import { Loader } from "@/components/custom ui/loader";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { UserTable } from "@/pages/panel/users/user-table";
import useUserStore, { useUsers } from "@/store/zustand/users";
import { useEffect, useState } from "react";
import { UserFooter } from "./user-footer";
import { UserHeader } from "./user-header";
import { CustomAxiosError } from "@/utils/types/axios";

export const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setBreadcrumbs } = useBreadcrumb();

  const { currentPage, itemsPerPage, setCurrentPage } = useUserStore();
  const { data, isLoading, error } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    role: undefined,
  });

  const paginationData = data && {
    lastIndex: currentPage * itemsPerPage,
    firstIndex: currentPage * itemsPerPage - itemsPerPage,
    totalUsers: data.totalUsers,
  };

  const navigation = {
    navigateToNextPage: () => {
      setCurrentPage(currentPage + 1);
    },
    navigateToPreviousPage: () => {
      setCurrentPage(currentPage - 1);
    },
    navigateToNthPage: (nthPageNumber: number) => {
      setCurrentPage(nthPageNumber);
    },
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    navigation.navigateToNthPage(1);
  };

  useEffect(() => {
    setBreadcrumbs([{ label: "Users" }]);
  }, []);

  if (isLoading) {
    return (
      <div className=" h-[60svh] w-full flex justify-center items-center flex-col gap-2">
        <Loader />
      </div>
    );
  }

  const e = error as CustomAxiosError;
  if (error) {
    console.log(error);
    return <div>Error occurred: {e.response?.data.error}</div>;
  }

  return (
    <div className="w-full flex items-center flex-col gap-2">
      <UserHeader
        nthClick={navigation.navigateToNthPage}
        prevClick={navigation.navigateToPreviousPage}
        nextClick={navigation.navigateToNextPage}
        currPage={data?.currentPage}
        nPage={data?.totalPages}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        recordLabel={paginationData?.recordCounter || ""}
      />
      <UserTable
        userList={data?.users || []}
        firstIndex={paginationData?.firstIndex || 1}
      />
      <UserFooter currPage={data?.currentPage} npages={data?.totalPages} />
    </div>
  );
};
