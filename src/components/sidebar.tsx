"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors duration-300 ease-in-out hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      isActive: {
        true: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

export interface ItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof itemVariants> {
  asChild?: boolean
}

const SidebarItem = React.forwardRef<HTMLButtonElement, ItemProps>(
  ({ className, isActive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(itemVariants({ isActive, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SidebarItem.displayName = "SidebarItem"

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
    { className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-r bg-muted/40", className)}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
    { className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
    { className, ...props }, ref) => (
    <nav ref={ref} className={cn("grid items-start gap-1", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>((
    { className, ...props }, ref) => (
    <span ref={ref} className={cn("", className)} {...props} />
))
SidebarLabel.displayName = "SidebarLabel"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>((
    { className, ...props }, ref) => (
    <button ref={ref} className={cn("", className)} {...props} />
))
SidebarTrigger.displayName = "SidebarTrigger"

export {
    Sidebar,
    SidebarContent,
    SidebarItem,
    SidebarMenu,
    SidebarLabel,
    SidebarTrigger
}