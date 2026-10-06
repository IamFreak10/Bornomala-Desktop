import {
  MoreVertical,
  BookOpen,
  User,
  Tag,
  Boxes,
  Pencil,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onDelete?: (book: Book) => void;
  onEdit?: (book: Book) => void;
}

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const hasDiscount = book.has_discount && Number(book.disCountPrice) > 0;
  const stockLevel =
    book.quantity === 0 ? 'out' : book.quantity < 5 ? 'low' : 'ok';

  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5">
      {/* Discount ribbon */}
      {hasDiscount && (
        <div className="absolute top-3 left-0 z-10 rounded-r-full bg-brand-saffron px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          ছাড়!
        </div>
      )}

      {/* Action menu */}
      <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm border border-border/60 shadow-sm"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit?.(book)} className="gap-2 text-xs cursor-pointer">
              <Pencil className="h-3 w-3" />
              সম্পাদনা করুন
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(book)}
              className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              মুছে ফেলুন
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cover image */}
      <div className="relative h-40 w-full overflow-hidden bg-muted/40">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.bookName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Book name */}
        <h3
          className="font-semibold text-sm leading-tight text-foreground line-clamp-2"
          style={{ fontFamily: 'var(--font-bengali)' }}
        >
          {book.bookName}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{book.authorName}</span>
        </div>

        {/* Course code */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Tag className="h-3 w-3 shrink-0" />
          <span className="font-mono text-[10px] truncate">{book.courseCode}</span>
        </div>

        {/* Pricing row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {hasDiscount ? (
              <>
                <span className="text-sm font-bold text-brand-saffron">
                  ৳{book.disCountPrice}
                </span>
                <span className="text-xs line-through text-muted-foreground">
                  ৳{book.price}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-foreground">
                ৳{book.price}
              </span>
            )}
          </div>

          {/* Stock badge */}
          {stockLevel === 'out' ? (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              স্টক নেই
            </Badge>
          ) : stockLevel === 'low' ? (
            <Badge variant="saffron" className="text-[10px] px-1.5 py-0">
              <Boxes className="h-2.5 w-2.5 mr-0.5" />
              {book.quantity}টি বাকি
            </Badge>
          ) : (
            <Badge variant="success" className="text-[10px] px-1.5 py-0">
              <Boxes className="h-2.5 w-2.5 mr-0.5" />
              {book.quantity}টি
            </Badge>
          )}
        </div>

        {/* Sales indicator */}
        {book.sales > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground border-t border-border/50 pt-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>{book.sales}টি বিক্রিত</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
