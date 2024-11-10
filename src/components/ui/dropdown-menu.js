// components/ui/dropdown-menu.js
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { cn } from "@/lib/utils"; // Optional utility for custom class names

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = forwardRef((props, ref) => (
  <DropdownMenuPrimitive.Content ref={ref} {...props} className="bg-white shadow-md p-2 rounded-md" />
));
export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuLabel = DropdownMenuPrimitive.Label;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
