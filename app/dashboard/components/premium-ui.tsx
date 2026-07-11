"use client";

import type { ButtonHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function PremiumFieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="premium-field-label">
      {children}
    </label>
  );
}

export function PremiumInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`premium-input ${className}`.trim()}
      {...props}
    />
  );
}

export function PremiumTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`premium-input premium-textarea ${className}`.trim()}
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
    <select className={`premium-input premium-select ${className}`.trim()} {...props}>
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
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          disabled={disabled}
          aria-pressed={value === option.id}
          className={`premium-pill${value === option.id ? " premium-pill--active" : ""}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PremiumSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`premium-spinner ${className}`}
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
      className={`premium-generate-btn ${className}`.trim()}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
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
      className={`premium-copy-btn ${className}`.trim()}
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
  return <p className="premium-result-text">{children}</p>;
}

export function PremiumResultCard({
  index,
  children,
  onCopy,
  copied = false,
  delay = 0,
}: {
  index: number;
  children: ReactNode;
  onCopy: () => void;
  copied?: boolean;
  delay?: number;
}) {
  return (
    <li
      className="premium-result-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <PremiumCopyButton
        onClick={onCopy}
        copied={copied}
        className="premium-result-card-copy"
      />
      <span className="premium-result-badge">{index}</span>
      <div className="min-w-0 flex-1 pr-8">{children}</div>
    </li>
  );
}

export function PremiumLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="premium-loading-section">
      <ul className="space-y-3">
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="premium-skeleton-card"
            style={{ animationDelay: `${index * 0.08}s` }}
          />
        ))}
      </ul>
    </section>
  );
}

export function PremiumError({ message }: { message: string }) {
  return (
    <p className="premium-error">{message}</p>
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
      <h2 className="text-base font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>
      <p className="mt-1 text-xs text-white/35">{subtitle}</p>
    </div>
  );
}
