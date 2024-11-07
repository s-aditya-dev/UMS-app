import { Link } from "react-router-dom";
import { Fragment } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { ModeToggle } from "@/components/custom ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  currContent: string;
  logoutFunc: () => void;
}

const Nav: React.FC<NavProps> = ({ currContent, logoutFunc, className, ...props }) => {
  return (
    <nav
      className={cn(
        "bg-card border-b-2 h-full w-full py-4 px-6 flex items-center justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-4">
        <Breadcrumbs />
      </div>

      <h1 className="md:hidden text-lg font-semibold md:text-2xl">{currContent}</h1>
      <div className="flex items-center justify-center gap-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <Avatar>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutFunc()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export const Breadcrumbs = () => {
  const { breadcrumbs: BreadcrumbItems } = useBreadcrumb();
  return (
    <Breadcrumb className="hidden md:flex items-center">
      <BreadcrumbList>
        {BreadcrumbItems.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className="font-semibold">
              {item.to ? (
                <BreadcrumbLink asChild>
                  <Link to={item.to}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < BreadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="[&>svg]:size-5">
                <ChevronRight strokeWidth={2.5} />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export { Nav };
