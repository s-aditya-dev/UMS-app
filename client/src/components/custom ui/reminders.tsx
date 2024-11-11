import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const Remiders = () => {
  return (
    <Card className="max-w-xs w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Reminders</CardTitle>
        <Button variant="outline" size="icon">
          <Plus />
        </Button>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
