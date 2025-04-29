import React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  )
})
Timeline.displayName = "Timeline"

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative pl-8 pb-4", className)} {...props}>
      <div className="absolute left-0 top-0 h-full w-px bg-border" />
      <div className="absolute left-0 top-2 h-4 w-4 rounded-full border bg-background" />
      {children}
    </div>
  )
})
TimelineItem.displayName = "TimelineItem"

interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
        {children}
      </h3>
    )
  },
)
TimelineTitle.displayName = "TimelineTitle"

interface TimelineTimeProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const TimelineTime = React.forwardRef<HTMLParagraphElement, TimelineTimeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <time ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
        {children}
      </time>
    )
  },
)
TimelineTime.displayName = "TimelineTime"

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mt-2 text-muted-foreground", className)} {...props}>
        {children}
      </div>
    )
  },
)
TimelineContent.displayName = "TimelineContent"

export { Timeline, TimelineItem, TimelineTitle, TimelineTime, TimelineContent }
