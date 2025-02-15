import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    value: string;
    title: string;
  }[];
  onChangeNav: (nav: string) => void;
  current: string;
}

export function SidebarNav({
  className,
  items,
  current,
  onChangeNav,
  ...props
}: SidebarNavProps) {
  function handleNav(value: string) {
    onChangeNav(value);
  }

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.value}
          onClick={() => handleNav(item.value)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            current === item.value
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline cursor-poi",
            "justify-start"
          )}
        >
          {item.title}
        </div>
      ))}
    </nav>
  );
}
