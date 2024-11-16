import { PaginationControls } from "../custom ui/pagination-controls";
import { Input } from "../ui/input";
import { UserAddButton } from "./user-add-button";
import { UserFilterButton } from "./user-filter-button";

interface UserHeaderProp {
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

      <PaginationControls
        currPage={currPage}
        nPage={nPage}
        nthClick={nthClick}
        prevClick={prevClick}
        nextClick={nextClick}
      />
    </div>
  );
};
