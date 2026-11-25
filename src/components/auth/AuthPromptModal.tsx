"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Login01Icon,
  Bookmark01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

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
  title = "সংরক্ষণ করতে সাইন-ইন করুন",
  description = "কথোপকথন শোনা এবং পড়া সম্পূর্ণ ফ্রি। তবে আপনার ব্যক্তিগত শব্দভান্ডার এবং শেখার অগ্রগতি ক্লাউডে সংরক্ষণ করতে সাইন-ইন প্রয়োজন।",
  actionText = "শব্দটি সংরক্ষণ করতে সাইন-ইন করুন",
}: AuthPromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 sm:p-7 rounded-card">
        <DialogHeader className="text-left space-y-2">
          <div className="size-control rounded-control bg-primary/10 text-primary flex items-center justify-center mb-1">
            <HugeiconsIcon icon={Bookmark01Icon} size={22} />
          </div>
          <DialogTitle className="text-card-title-bn">
            {title}
          </DialogTitle>
          <DialogDescription className="text-meta-lead-bn">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Feature Benefits */}
        <div className="bg-muted/50 rounded-panel p-3.5 my-3 space-y-2 border border-border">
          <div className="flex items-center gap-2.5 text-meta text-foreground text-bangla">
            <HugeiconsIcon icon={SparklesIcon} size={15} className="text-primary shrink-0" />
            <span>যেকোনো সময় সেভ করা শব্দের তালিকা রিভিশন দিন</span>
          </div>
          <div className="flex items-center gap-2.5 text-meta text-foreground text-bangla">
            <HugeiconsIcon icon={SparklesIcon} size={15} className="text-primary shrink-0" />
            <span>মোবাইল ও কম্পিউটার সব ডিভাইসে সিংক্রোনাইজড থাকবে</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link href="/auth/login?reason=save" className="w-full sm:flex-1 min-w-0">
            <Button className="btn-press w-full justify-center gap-2 text-bangla text-label rounded-control">
              <HugeiconsIcon icon={Login01Icon} size={16} />
              <span>লগইন / সাইন-আপ করুন</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onClose}
            className="btn-press w-full sm:flex-1 min-w-0 justify-center text-bangla text-label text-muted-foreground rounded-control"
          >
            পরে করব
          </Button>
        </div>

        <p className="text-center text-chip text-muted-foreground mt-2">
          {actionText} • শেখার স্থান কখনো হারাবে না
        </p>
      </DialogContent>
    </Dialog>
  );
}
