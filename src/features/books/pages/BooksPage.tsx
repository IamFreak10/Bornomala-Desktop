import * as React from 'react';
import {
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  BookMarked,
  AlertCircle,
  Loader2,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooksStore } from '../store';
import { useBooksQuery, useDeleteBookMutation } from '../queries';
import { AddBookDialog } from '../components/AddBookDialog';
import { AddCourseDialog } from '../components/AddCourseDialog';
import { EditBookDialog } from '../components/EditBookDialog';
import { CourseSection } from '../components/CourseSection';
import type { Book } from '../types';

export function BooksPage() {
  const {
    selectedDeptId,
    selectedSemId,
    searchQuery,
    initSelection,
    setSelectedDept,
    setSelectedSem,
    setSearchQuery,
  } = useBooksStore();

  const { data: departments = [], isLoading, isError, refetch } = useBooksQuery();
  const deleteMutation = useDeleteBookMutation();

  React.useEffect(() => {
    if (departments.length > 0) initSelection(departments);
  }, [departments, initSelection]);

  const [addOpen, setAddOpen] = React.useState(false);
  const [addCourseOpen, setAddCourseOpen] = React.useState(false);
  const [editBook, setEditBook] = React.useState<Book | null>(null);

  const selectedDept = departments.find((d) => d.departmentId === selectedDeptId);
  const selectedSem = selectedDept?.semesters.find((s) => s.semesterId === selectedSemId);

  const filteredCourses = React.useMemo(() => {
    if (!selectedSem) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return selectedSem.courses;
    return selectedSem.courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q) ||
        c.books.some(
          (b) =>
            b.bookName.toLowerCase().includes(q) ||
            b.authorName.toLowerCase().includes(q)
        )
    );
  }, [selectedSem, searchQuery]);

  const totalBooks = React.useMemo(
    () => selectedSem?.courses.reduce((acc, c) => acc + c.books.length, 0) ?? 0,
    [selectedSem]
  );

  async function handleDeleteBook(book: Book) {
    if (!confirm(`"${book.bookName}" মুছে ফেলবেন?`)) return;
    deleteMutation.mutate(book.bookId);
  }

  function handleEditBook(book: Book) {
    setEditBook(book);
  }

  return (
    <div className="space-y-5 pb-10 animate-in fade-in-50 duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              বই ব্যবস্থাপনা
            </h1>
            <Badge variant="navy" className="text-[10px]">
              <BookMarked className="h-2.5 w-2.5 mr-1" />
              Catalogue
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
            প্রথমে সাবজেক্ট যোগ করুন, তারপর সেই সাবজেক্টে বই আপলোড করুন
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => refetch()}
            disabled={isLoading}
            title="রিফ্রেশ"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-semibold"
            onClick={() => setAddCourseOpen(true)}
            disabled={!selectedSem}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            সাবজেক্ট যোগ করুন
          </Button>
          <Button
            variant="saffron"
            size="sm"
            className="gap-1.5 text-xs font-semibold"
            onClick={() => setAddOpen(true)}
            disabled={!selectedSem || selectedSem.courses.length === 0}
            title={
              selectedSem && selectedSem.courses.length === 0
                ? 'আগে সাবজেক্ট যোগ করুন'
                : undefined
            }
          >
            <Plus className="h-3.5 w-3.5" />
            নতুন বই যোগ করুন
          </Button>
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>ডেটা লোড করতে ব্যর্থ হয়েছে</span>
          <Button
            variant="ghost"
            size="xs"
            className="ml-auto text-destructive hover:bg-destructive/10"
            onClick={() => refetch()}
          >
            আবার চেষ্টা করুন
          </Button>
        </div>
      )}

      {deleteMutation.isError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>বই মুছতে ব্যর্থ হয়েছে</span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-60 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !isError && departments.length > 0 && (
        <>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-0.5">
              বিভাগ
            </p>
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => {
                const isActive = dept.departmentId === selectedDeptId;
                return (
                  <button
                    key={dept.departmentId}
                    type="button"
                    onClick={() => setSelectedDept(dept.departmentId, departments)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                    style={{ fontFamily: 'var(--font-bengali)' }}
                  >
                    <Building2 className="h-3 w-3 shrink-0" />
                    {dept.departmentName}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDept && selectedDept.semesters.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-0.5">
                সেমিস্টার
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedDept.semesters.map((sem) => {
                  const isActive = sem.semesterId === selectedSemId;
                  const semBooks = sem.courses.reduce((a, c) => a + c.books.length, 0);
                  return (
                    <button
                      key={sem.semesterId}
                      type="button"
                      onClick={() => setSelectedSem(sem.semesterId)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'border-brand-saffron/40 bg-brand-saffron/10 text-brand-saffron'
                          : 'border-border bg-card text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      সেমিস্টার {sem.semesterNumber}
                      {semBooks > 0 && (
                        <span
                          className={`rounded-full px-1 text-[9px] font-bold ${
                            isActive
                              ? 'bg-brand-saffron/20 text-brand-saffron'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {semBooks}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedSem && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="বই, কোর্স বা লেখক খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-8"
                  disabled={selectedSem.courses.length === 0}
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">{selectedSem.courses.length}</span>
                  টি কোর্স
                </span>
                <span className="text-border">|</span>
                <span>
                  <span className="font-semibold text-foreground">{totalBooks}</span>টি বই
                </span>
                {deleteMutation.isPending && (
                  <span className="flex items-center gap-1 text-destructive">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    মুছছে...
                  </span>
                )}
              </div>
            </div>
          )}

          {filteredCourses.length > 0 ? (
            <div className="space-y-3">
              {filteredCourses.map((course) => (
                <CourseSection
                  key={course.courseCode}
                  course={course}
                  onAddBook={() => setAddOpen(true)}
                  onDeleteBook={handleDeleteBook}
                  onEditBook={handleEditBook}
                />
              ))}
            </div>
          ) : selectedSem && selectedSem.courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 py-16 text-center">
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                <GraduationCap className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  এই সেমিস্টারে এখনো কোনো সাবজেক্ট নেই
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  আগে সাবজেক্ট/কোর্স যোগ করুন, তারপর সেই সাবজেক্টে বই আপলোড করা যাবে।
                </p>
              </div>
              <Button
                variant="saffron"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setAddCourseOpen(true)}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                সাবজেক্ট যোগ করুন
              </Button>
            </div>
          ) : selectedSem ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 py-16 text-center">
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                <Search className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">কোনো ফলাফল পাওয়া যায়নি</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  "{searchQuery}" — এই অনুসন্ধানে কোনো কোর্স বা বই মেলেনি
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-xs"
              >
                অনুসন্ধান মুছুন
              </Button>
            </div>
          ) : null}
        </>
      )}

      {!isLoading && !isError && departments.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">কোনো ডেটা পাওয়া যায়নি</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              সার্ভার থেকে বিভাগ লোড হয়নি। ব্যাকএন্ডে seed চালান: npm run seed
            </p>
          </div>
          <Button variant="saffron" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            আবার লোড করুন
          </Button>
        </div>
      )}

      <AddCourseDialog
        open={addCourseOpen}
        onOpenChange={setAddCourseOpen}
        departments={departments}
        defaultDeptId={selectedDeptId}
        defaultSemId={selectedSemId}
      />

      <AddBookDialog open={addOpen} onOpenChange={setAddOpen} departments={departments} />

      <EditBookDialog
        book={editBook}
        open={editBook !== null}
        onOpenChange={(open) => {
          if (!open) setEditBook(null);
        }}
      />
    </div>
  );
}
