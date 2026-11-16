"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Login01Icon,
  Bookmark01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function AuthPromptModal({
  isOpen,
  onClose,
  title = "সংরক্ষণ করতে সাইন-ইন করুন (Sign In to Save)",
  description = "কথোপকথন শোনা এবং পড়া সম্পূর্ণ ফ্রি। তবে আপনার ব্যক্তিগত শব্দভান্ডার এবং শেখার অগ্রগতি ক্লাউডে সংরক্ষণ করতে সাইন-ইন প্রয়োজন।",
  actionText = "শব্দটি সংরক্ষণ করতে সাইন-ইন করুন",
}: AuthPromptModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="document"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-ecp-border p-6 sm:p-7 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন (Close)"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-ecp-text-muted hover:text-ecp-text-primary hover:bg-ecp-bg-canvas transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>

        {/* Modal Header Icon */}
        <div className="w-12 h-12 rounded-xl bg-ecp-violet-surface text-ecp-violet flex items-center justify-center mb-4">
          <HugeiconsIcon icon={Bookmark01Icon} size={24} className="text-ecp-violet" />
        </div>

        <h3
          id="auth-prompt-title"
          className="text-lg sm:text-xl font-bold text-ecp-text-primary mb-2 font-bangla"
        >
          {title}
        </h3>

        <p className="text-sm text-ecp-text-secondary leading-relaxed mb-5 font-bangla">
          {description}
        </p>

        {/* Value Prop Highlights */}
        <div className="bg-ecp-bg-canvas rounded-xl p-3.5 mb-6 space-y-2 border border-ecp-border">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-ecp-text-primary font-bangla">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-ecp-violet shrink-0" />
            <span>যেকোনো সময় সেভ করা শব্দের তালিকা রিভিশন দিন</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-ecp-text-primary font-bangla">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-ecp-violet shrink-0" />
            <span>মোবাইল ও কম্পিউটার সব ডিভাইসে সিংক্রোনাইজড থাকবে</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link href="/auth/login?reason=save" className="w-full">
            <Button
              className="w-full justify-center gap-2 font-bangla"
            >
              <HugeiconsIcon icon={Login01Icon} size={16} />
              <span>লগইন / সাইন-আপ করুন</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full justify-center font-bangla text-ecp-text-secondary"
          >
            পরে করব (Continue)
          </Button>
        </div>

        <p className="text-center text-[11px] text-ecp-text-muted mt-4">
          {actionText} • শেখার স্থান কখনো হারাবে না
        </p>
      </div>
    </div>
  );
}
