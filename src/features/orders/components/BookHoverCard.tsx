import * as React from "react";
import { BookOpen, Sparkles, Tag } from "lucide-react";
import type { BookDetail } from "../types";

interface BookHoverCardProps {
  book?: BookDetail | null;
  quantity?: number;
  unitPrice?: string;
  children: React.ReactNode;
  side?: "right" | "left" | "top" | "bottom";
}

export function BookHoverCard({
  book,
  quantity = 1,
  unitPrice,
  children,
  side = "top",
}: BookHoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const title = book?.bookName || "বই";
  const author = book?.authorName || "";
  const cover = book?.coverImage;
  const price = unitPrice || book?.price || "0";
  const courseCode = book?.courseCode;

  const positionClasses = {
    top: "bottom-full left-0 mb-3",
    bottom: "top-full left-0 mt-3",
    right: "left-full top-0 ml-3",
    left: "right-full top-0 mr-3",
  }[side] || "bottom-full left-0 mb-3";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="cursor-pointer transition-transform hover:scale-105">
        {children}
      </div>

      {isOpen && (
        <div
          className={`absolute z-[100] w-72 overflow-hidden rounded-2xl border border-border bg-popover/98 p-3 text-popover-foreground shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in-0 zoom-in-95 pointer-events-none ${positionClasses}`}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="flex gap-3">
            {/* High-res Image Preview */}
            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-md">
              {cover ? (
                <img
                  src={cover}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <BookOpen className="h-8 w-8 opacity-40" />
                </div>
              )}
              <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1 py-0.5 text-[9px] font-bold text-white font-mono backdrop-blur-xs">
                x{quantity}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between min-w-0 flex-1">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  বইয়ের তথ্য
                </span>
                <h4 className="mt-1 text-xs font-bold text-foreground line-clamp-2 leading-snug">
                  {title}
                </h4>
                {author && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                    {author}
                  </p>
                )}
                {courseCode && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Tag className="h-2.5 w-2.5" />
                    <span>কোর্স: {courseCode}</span>
                  </div>
                )}
              </div>

              {/* Price details */}
              <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">প্রতি কপি</span>
                  <span className="font-semibold text-foreground">৳{price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">মোট প্রদেয়</span>
                  <span className="font-bold text-primary font-mono">
                    ৳{Number(price) * quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
