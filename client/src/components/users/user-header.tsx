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
  pageno: string | number | undefined;
}

export const UserHeader = ({ filter, setFilter, pageno }: UserHeaderProp) => {
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="w-full flex justify-around sm:justify-between items-center gap-2 flex-wrap">
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

      <h2 className="font-semibold">Rocord Count : {pageno}</h2>

      <Card className="p-1 px-1.5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  );
};
