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

interface UserHeaderProp {
  filter: string;
  setFilter: (value: string) => void;
  currPage: number;
  nPage: number;
  nthClick: (pageNo: number) => void;
  prevClick: () => void;
  nextClick: () => void;
}

export const UserHeader = ({
  filter,
  setFilter,
  currPage,
  nPage,
  nthClick,
  prevClick,
  nextClick,
}: UserHeaderProp) => {
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="w-full flex justify-around md:justify-between items-center gap-2 flex-wrap">
      <div className="flex gap-2">
        <Input
          placeholder="Search users"
          className="max-w-xs"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
        <UserFilterButton />
        <UserAddButton />
      </div>

      <h2 className="font-semibold">Rocord Count : </h2>

      <Card className="p-1 px-1.5">
        <Pagination>
          <PaginationContent>
            {currPage != 1 && (
              <>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious onClick={() => prevClick()} />
                </PaginationItem>
                <PaginationItem className="cursor-pointer">
                  <PaginationLink onClick={() => nthClick(1)}>1</PaginationLink>
                </PaginationItem>
              </>
            )}
            {currPage != 1 ||
              (currPage != nPage && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ))}
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
    </div>
  );
};
