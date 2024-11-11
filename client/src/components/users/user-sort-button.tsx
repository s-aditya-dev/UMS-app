import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip } from "../custom ui/tooltip-provider";

export const UserSortButton = () => {
  return (
    <Tooltip content="Sort users" side="bottom">
      <Button variant="outline" size="icon">
        <ArrowDownUp />
      </Button>
    </Tooltip>
  );
};
