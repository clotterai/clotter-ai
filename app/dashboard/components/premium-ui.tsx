"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode, TextareaHTMLAttributes } from "react";

const gradientButtonStyle: CSSProperties = {
  background: "linear-gradient(135deg, #EC4899, #F97316)",
};

const gradientBadgeStyle: CSSProperties = {
  background: "linear-gradient(135deg, #EC4899, #F97316)",
};

const pillActiveStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(249, 115, 22, 0.15))",
};

const inputClassName =
  "w-full rounded-2xl border border-white/[0.06] bg-[#111114] px-4 py-3 text-sm text-white placeholder-white/20 transition-all duration-200 focus:border-pink-500/40 focus:outline-none";

const labelClassName =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25";

export function PremiumFieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClassName}>
      {children}
    </label>
  );
}

export function PremiumInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputClassName} ${className}`.trim()} {...props} />;
}

export function PremiumTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${inputClassName} min-h-[100px] resize-none ${className}`.trim()}
      {...props}
    />
  );
}

export function PremiumSelect({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputClassName} ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}

type PillOption = { id: string; label: string };

export function PremiumPillGroup({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: readonly PillOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            disabled={disabled}
            aria-pressed={isActive}
            className={`cursor-pointer rounded-full border px-4 py-2 text-xs transition-all duration-150 ${
              isActive
                ? "border-pink-500/50 font-medium text-white"
                : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-white/15 hover:text-white/60"
            }`}
            style={isActive ? pillActiveStyle : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function PremiumSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PremiumGenerateButton({
  children,
  loading = false,
  loadingLabel = "Generating",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-2xl py-4 text-sm font-semibold text-white transition-all duration-150 hover:scale-[1.01] hover:brightness-110 disabled:opacity-70 ${className}`.trim()}
      style={gradientButtonStyle}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2 opacity-70">
          <PremiumSpinner />
          {loadingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function PremiumCopyButton({
  onClick,
  copied = false,
  className = "",
}: {
  onClick: () => void;
  copied?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-white/20 transition-colors hover:text-white/60 ${className}`.trim()}
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M3.5 8.5l3 3 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <rect
            x="5"
            y="5"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M5 11H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5h5.5A1.5 1.5 0 0 1 11 4v1"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </svg>
      )}
    </button>
  );
}

export function PremiumResultText({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] leading-relaxed text-white/75">{children}</p>
  );
}

export function PremiumResultCard({
  index,
  children,
  onCopy,
  copied = false,
}: {
  index: number;
  children: ReactNode;
  onCopy: () => void;
  copied?: boolean;
  delay?: number;
}) {
  return (
    <li className="relative rounded-2xl border border-white/[0.06] bg-[#111114] p-5 transition-all duration-200 hover:border-white/[0.12]">
      <PremiumCopyButton
        onClick={onCopy}
        copied={copied}
        className="absolute right-4 top-4"
      />
      <span
        className="mb-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
        style={gradientBadgeStyle}
      >
        {index}
      </span>
      <div className="min-w-0 pr-8">{children}</div>
    </li>
  );
}

export function PremiumLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="h-24 animate-pulse rounded-2xl border border-white/[0.06] bg-[#111114]"
        />
      ))}
    </ul>
  );
}

export function PremiumError({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {message}
    </p>
  );
}

export function PremiumResultsHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-1 text-xs text-white/35">{subtitle}</p>
    </div>
  );
}

export const premiumInputClassName = inputClassName;
export const premiumPillActiveStyle = pillActiveStyle;
export const premiumGradientButtonStyle = gradientButtonStyle;
