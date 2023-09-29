import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./sidebar";

function MobileSidebar() {
    const [open, setOpen] = useState(false);
    return (
        <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Menu />
                </SheetTrigger>
                <SheetContent className="p-0 bg-white pt-10 w-32" side={"left"}>
                    <Sidebar setOpen={setOpen} />
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileSidebar;
