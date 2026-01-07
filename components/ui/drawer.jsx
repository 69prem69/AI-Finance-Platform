"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

function Drawer({
  ...props
}) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

function DrawerContent({ children, ...props }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />

      <DrawerPrimitive.Content
        data-slot="drawer-content"
        style={{
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  maxHeight: "85vh",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff",
  color: "#000000",
  borderTop: "1px solid #e5e7eb",
  borderTopLeftRadius: "1rem",
  borderTopRightRadius: "1rem",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  opacity: 1,
}}
        {...props}
      >
        <div
          style={{
            margin: "0.5rem auto",
            height: "6px",
            width: "48px",
            borderRadius: "9999px",
            backgroundColor: "#9ca3af", // gray-400
          }}
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}


function DrawerHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props} />
  );
}

function DrawerFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

function DrawerTitle({
  className,
  ...props
}) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props} />
  );
}

function DrawerDescription({
  className,
  ...props
}) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
