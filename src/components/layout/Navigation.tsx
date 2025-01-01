import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <header className="fixed top-0 w-full bg-[#848ac8] z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b8c19210-8dc7-4ed7-858c-f00f6267982e.png" 
              alt="Write AI Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#848ac8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9599d1] focus:bg-[#9599d1] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#9599d1]/50 data-[state=open]:bg-[#9599d1]/50">
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/signin">
            <Button variant="ghost" className="text-white hover:bg-[#9599d1]">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-white text-[#848ac8] hover:bg-gray-100">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}