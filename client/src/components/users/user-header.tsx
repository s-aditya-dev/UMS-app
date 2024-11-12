import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { UserAddButton } from "./user-add-button";
import { UserFilterButton } from "./user-filter-button";
import { UserSortButton } from "./user-sort-button";

interface UserHeaderProp {
  // filter: string;
  // setFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currPage: number;
  nPage: number;
  nthClick: (pageNo: number) => void;
  prevClick: () => void;
  nextClick: () => void;
  recordLabel: string;
}

export const UserHeader = ({
  // filter,
  // setFilter,
  searchTerm,
  setSearchTerm,
  currPage,
  nPage,
  nthClick,
  prevClick,
  nextClick,
  recordLabel,
}: UserHeaderProp) => {
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="w-full flex justify-around md:justify-between items-center gap-2 flex-wrap">
      <div className="flex gap-2">
        <Input
          placeholder="Search users"
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <UserFilterButton />
        <UserAddButton />
      </div>

      <h2 className="font-semibold text-lg">{recordLabel}</h2>

      <div className="flex justify-center items-center flex-wrap-reverse gap-2">
        <UserSortButton />
        {nPage > 1 && (
          <Card className="p-1 px-1.5">
            <Pagination>
              <PaginationContent>
                {currPage != 1 && (
                  <>
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious onClick={() => prevClick()} />
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                      <PaginationLink onClick={() => nthClick(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                {currPage != 1 && currPage != nPage && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {currPage != nPage && (
                  <>
                    <PaginationItem className="cursor-pointer">
                      <PaginationLink onClick={() => nthClick(nPage)}>
                        {nPage}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                      <PaginationNext onClick={() => nextClick()} />
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
            </Pagination>
          </Card>
        )}
      </div>
    </div>
  );
};
