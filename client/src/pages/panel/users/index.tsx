import { CenterWrapper } from "@/components/custom ui/center-page";
import { ErrorDisplay } from "@/components/custom ui/error-display";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useDebounce } from "@/hooks/use-debounce";
import { UserTable } from "@/pages/panel/users/user-table";
import useUserStore, { useUsers } from "@/store/users";
import { CustomAxiosError } from "@/utils/types/axios";
import { useCallback, useEffect, useState } from "react";
import { UserFooter } from "./user-footer";
import { UserHeader } from "./user-header";
import { UserSkeleton } from "./user-skeleton";

export const UserList = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const {
    currentPage,
    itemsPerPage,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    selectedRole,
    setSelectedRole,
  } = useUserStore();

  // Local state for input value
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [isFiltered, setIsFiltered] = useState(false);

  // Debounced function to update store and trigger API call
  const debouncedSetSearch = useDebounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 600);

  // Handle input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value); // Update local state immediately
      debouncedSetSearch(value); // Debounce the store update
      setIsFiltered(true);
      if (value === "" && !selectedRole) setIsFiltered(false);
    },
    [debouncedSetSearch, selectedRole],
  );

  const handleRoleChange = useCallback(
    (value: string) => {
      setSelectedRole(value);
      setCurrentPage(1);
      setIsFiltered(true);
    },
    [setSelectedRole, setCurrentPage, setIsFiltered],
  );

  const handleClearFilter = useCallback(() => {
    setSearchTerm("");
    debouncedSetSearch("");
    setSelectedRole(null);
    setIsFiltered(false);
  }, [setSearchTerm, debouncedSetSearch, setSelectedRole, setIsFiltered]);

  const { data, isLoading, error } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    role: selectedRole || undefined,
    search: searchQuery, // This uses the debounced value from store
  });

  const paginationData = data && {
    lastIndex: currentPage * itemsPerPage,
    firstIndex: currentPage * itemsPerPage - itemsPerPage,
    totalUsers: data.totalUsers,
  };

  const navigation = {
    currentPage: data?.currentPage || 0,
    totalPages: data?.totalPages || 0,
    onNext: () => setCurrentPage(currentPage + 1),
    onPrevious: () => setCurrentPage(currentPage - 1),
    onPageChange: (nthPageNumber: number) => setCurrentPage(nthPageNumber),
  };

  const filter = {
    searchTerm: searchTerm,
    onSearchChange: handleSearchChange,
    selectedRole: selectedRole || "",
    onRoleChange: handleRoleChange,
    isFiltered: isFiltered,
    onClearFilter: handleClearFilter,
  };

  useEffect(() => {
    setBreadcrumbs([{ label: "Users" }]);
  }, [setBreadcrumbs]);

  if (isLoading) {
    return (
      <UserSkeleton />
      // <CenterWrapper>
      // </CenterWrapper>
    );
  }

  if (error) {
    const { response, message } = error as CustomAxiosError;
    let errMsg = response?.data.error ?? message;
    let needLogin = false;
    if (errMsg === "Access denied. No token provided") {
      errMsg = "Access denied. No token provided please login again";
      needLogin = true;
    }
    return (
      <CenterWrapper className="px-2 gap-2 text-center">
        <ErrorDisplay errMsg={errMsg} isLoginRequired={needLogin} />
      </CenterWrapper>
    );
  }

  return (
    <div className="w-full flex items-center flex-col gap-2">
      <UserHeader
        filter={filter}
        pagination={navigation}
        recordInfo={paginationData || {}}
      />
      <UserTable
        userList={data?.users || []}
        firstIndex={paginationData?.firstIndex}
      />
      <UserFooter
        currPage={data?.currentPage || 0}
        npages={data?.totalPages || 0}
      />
    </div>
  );
};
