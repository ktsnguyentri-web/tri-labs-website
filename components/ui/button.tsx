import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Standardized Modern CTA Button Component
 * 
 * Design: Apple-inspired rounded pill shape, smooth tactile feedback (active:scale-[0.96]),
 * adaptive dark/light contrast styling, uppercase tracking metadata font.
 * Features: Automatic ArrowRight icon (customizable), 'asChild' support for Next.js Links.
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap label-caps rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white shadow-sm hover:shadow-md",
        outline: "border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white",
        ghost: "text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        pill: "bg-neutral-900/90 text-white hover:bg-neutral-900 dark:bg-white/90 dark:text-neutral-950 dark:hover:bg-white backdrop-blur-md shadow-sm",
      },
      size: {
        default: "px-6 py-2.5 text-[11px]",
        sm: "px-4 py-1.5 text-[10px]",
        lg: "px-8 py-3.5 text-xs",
        icon: "h-9 w-9 p-0 rounded-full",
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
