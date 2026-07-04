import { LegalPageShell } from "@/app/components/legal-page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Clotter AI",
  description: "How Clotter AI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p className="text-sm text-white/50">Last updated: July 2026</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">What we collect</h2>
        <p>
          When you use Clotter AI, we may collect the following information:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-white/75">
          <li>Your email address</li>
          <li>Google account information provided during sign-in</li>
          <li>
            Your creator profile, including niche, platforms, and goals
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">How we use it</h2>
        <p>
          We use your information to provide AI-powered content creation
          features tailored to your creator profile, including captions, hooks,
          scripts, trends, and personalized creative assistance.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Data storage</h2>
        <p>
          Your data is stored securely via Supabase. We take reasonable measures
          to protect your information from unauthorized access, alteration, or
          disclosure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">
          We do not sell your data
        </h2>
        <p>
          Clotter AI does not sell, rent, or trade your personal information to
          third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{" "}
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
