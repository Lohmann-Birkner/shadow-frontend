import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ icon, className, type, ...props }, ref) => {
        return (
            <div
                tabIndex={0}
                className={cn(
                    "flex shadow-sm h-9 justify-between items-center w-full rounded-md border border-input bg-background px-2 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}>
                <input
                    className="focus-visible:outline-none w-full"
                    type={type}
                    ref={ref}
                    {...props}
                />
                {icon}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
