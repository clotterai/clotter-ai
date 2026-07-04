import { LegalPageShell } from "@/app/components/legal-page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Clotter AI",
  description: "Terms and conditions for using Clotter AI.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <p className="text-sm text-white/50">Last updated: July 2026</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Agreement</h2>
        <p>
          By using Clotter AI, you agree to these Terms of Service. If you do not
          agree, please do not use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Use of the service</h2>
        <p>
          Clotter AI is provided for content creation purposes only. You agree to
          use the platform responsibly and in compliance with applicable laws and
          platform guidelines.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">AI-generated content</h2>
        <p>
          Clotter AI may make mistakes. Verify important information before
          using AI-generated captions, hooks, scripts, or other content in your
          work.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Changes to these terms</h2>
        <p>
          We reserve the right to update these Terms of Service at any time.
          Continued use of Clotter AI after changes are posted constitutes
          acceptance of the updated terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p>
          If you have questions about these Terms of Service, contact us at{" "}
          <a
            href="mailto:clotterai@gmail.com"
            className="font-medium text-[#EC4899] transition-colors hover:text-[#F97316]"
          >
            clotterai@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
