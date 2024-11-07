import { ListFilter } from "lucide-react";
import { Tooltip } from "../custom ui/tooltip-provider";
import { Button } from "../ui/button";

export const UserFilterButton = () => {
  return (
    <Tooltip content="Filter Users" side="bottom">
      <Button variant="outline" size="icon" className="px-2">
        <ListFilter />
      </Button>
    </Tooltip>
  );
};
