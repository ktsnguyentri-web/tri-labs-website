import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Standardized CTA Button Component
 * 
 * Design: Pill-shaped, Brutalist dark muted tone (#4A4443), White bold uppercase text.
 * Features: Automatic ArrowRight icon (customizable), 'asChild' support for Next.js Links.
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full label-caps transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#4A4443] text-white hover:bg-[#3D3837] shadow-lg",
        outline: "border-2 border-[#4A4443] text-[#4A4443] hover:bg-[#4A4443] hover:text-white",
        ghost: "text-[#4C4546] hover:bg-black/5",
        secondary: "bg-[#F3F4F6] text-[#4A4443] hover:bg-[#E5E7EB]",
      },
      size: {
        default: "px-8 py-3",
        sm: "px-6 py-2 text-xs",
        lg: "px-10 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Whether to show the default arrow icon. Defaults to true. */
  showIcon?: boolean;
  /** Custom icon to replace the default arrow. */
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, showIcon = true, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // When asChild is true, we merge the icon and children into the child component
    // But since Slot only takes one child, we recommend using the standard button 
    // or manually adding the icon inside the child if polymorphic.
    // For simplicity, we'll keep the icon injection for non-asChild buttons.
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span>{children}</span>
            {showIcon && (icon || <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={2.5} />)}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
