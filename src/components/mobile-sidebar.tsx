import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./sidebar";

function MobileSidebar() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                    <Menu />
                </SheetTrigger>
                <SheetContent className="p-0 bg-white pt-10 w-32" side={"left"}>
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileSidebar;
