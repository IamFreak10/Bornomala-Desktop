import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBooks, createBook, createCourse, updateBook, deleteBook } from './api';
import type { CreateBookPayload, CreateCoursePayload, Book } from './types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const booksKeys = {
  all: ['books'] as const,
  list: () => [...booksKeys.all, 'list'] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────
export function useBooksQuery() {
  return useQuery({
    queryKey: booksKeys.list(),
    queryFn: fetchBooks,
    staleTime: 1000 * 30,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────
export function useCreateCourseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => createCourse(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: booksKeys.list() });
    },
  });
}

export function useCreateBookMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookPayload) => createBook(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: booksKeys.list() });
    },
  });
}

export function useUpdateBookMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookId,
      data,
    }: {
      bookId: number;
      data: Partial<Pick<Book, 'bookName' | 'authorName' | 'price' | 'quantity' | 'has_discount' | 'disCountPrice'>>;
    }) => updateBook(bookId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: booksKeys.list() });
    },
  });
}

export function useDeleteBookMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookId: number) => deleteBook(bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: booksKeys.list() });
    },
  });
}
