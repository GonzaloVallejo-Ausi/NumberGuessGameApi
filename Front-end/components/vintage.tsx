import type { ReactNode, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/* A boxed advertisement panel, like the framed ads in the magazine. */
export function AdBox({
  children,
  className,
  double = false,
}: {
  children: ReactNode
  className?: string
  double?: boolean
}) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground border-foreground',
        double ? 'border-[3px] p-1' : 'border-2',
        className,
      )}
    >
      {double ? (
        <div className="border border-foreground p-5 sm:p-6 h-full">
          {children}
        </div>
      ) : (
        <div className="p-5 sm:p-6 h-full">{children}</div>
      )}
    </div>
  )
}

/* Rubber-stamp seal: FREE, GUARANTEED, etc. */
export function Stamp({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'stamp inline-block px-3 py-1 font-display font-bold uppercase tracking-wide text-sm leading-tight text-center',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* Coupon-style labeled input with an underline, like the mail-in forms. */
export function CouponField({
  label,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-baseline gap-2">
      <span className="font-display uppercase text-sm tracking-wide whitespace-nowrap text-foreground">
        {label}
      </span>
      <input
        {...props}
        className={cn(
          'flex-1 min-w-0 bg-transparent border-0 border-b-2 border-dotted border-foreground',
          'px-1 py-1 font-sans text-foreground placeholder:text-muted-foreground/70',
          'focus:outline-none focus:border-solid focus:border-accent',
          className,
        )}
      />
    </label>
  )
}

/* Section kicker in condensed caps, like "WRITE FOR FREE CATALOG". */
export function Kicker({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'font-display uppercase tracking-[0.2em] text-xs text-accent font-semibold',
        className,
      )}
    >
      {children}
    </p>
  )
}
