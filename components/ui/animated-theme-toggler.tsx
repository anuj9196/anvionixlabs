"use client"

import { useCallback, useEffect, useRef, useState, cloneElement, isValidElement } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "children"> {
  duration?: number
  children?: React.ReactNode
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  children,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | HTMLDivElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        setIsDark(newTheme)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", newTheme ? "dark" : "light")
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, duration])

  // If children is provided and is a valid React element, clone it and pass toggleTheme and isDark
  if (children !== undefined && isValidElement(children)) {
    const { onClick, ...divProps } = props as any
    return (
      <div ref={buttonRef as React.RefObject<HTMLDivElement>} className={cn(className)} {...divProps}>
        {cloneElement(children, {
          toggleTheme,
          isDark,
        } as any)}
      </div>
    )
  }

  // Default behavior: render button with Sun/Moon icons
  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {children !== undefined ? children : isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
