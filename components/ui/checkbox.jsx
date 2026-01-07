"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

function Checkbox({ className = "", style = {}, ...props }) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      style={{
        // 🔒 Force visible black border + white background
        border: "2px solid black",
        backgroundColor: "white",
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        ...style, // allow optional overrides
      }}
      className={className}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon
          style={{
            width: "16px",
            height: "16px",
            color: "black",
            strokeWidth: 3,
          }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
