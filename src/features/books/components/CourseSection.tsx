import * as React from 'react';
import { ChevronDown, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from './BookCard';
import type { Course, Book } from '../types';

interface CourseSectionProps {
  course: Course;
  onAddBook?: (courseCode: string) => void;
  onDeleteBook?: (book: Book) => void;
  onEditBook?: (book: Book) => void;
}

export function CourseSection({
  course,
  onAddBook,
  onDeleteBook,
  onEditBook,
}: CourseSectionProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const hasBooks = course.books.length > 0;

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold text-foreground truncate"
              style={{ fontFamily: 'var(--font-bengali)' }}
            >
              {course.courseName}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              {course.courseCode}
              {hasBooks && (
                <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0 text-primary font-sans">
                  {course.books.length}টি বই
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="gap-1 text-[11px] text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onAddBook?.(course.courseCode);
            }}
          >
            <Plus className="h-3 w-3" />
            বই যোগ করুন
          </Button>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              collapsed ? '-rotate-90' : ''
            }`}
          />
        </div>
      </button>

      {/* Books grid */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {hasBooks ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {course.books.map((book) => (
                <BookCard
                  key={book.bookId}
                  book={book}
                  onDelete={onDeleteBook}
                  onEdit={onEditBook}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 py-6 text-center">
              <BookOpen className="h-6 w-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">এই কোর্সে এখনো কোনো বই নেই</p>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="gap-1 text-[11px]"
                onClick={() => onAddBook?.(course.courseCode)}
              >
                <Plus className="h-3 w-3" />
                বই যোগ করুন
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
