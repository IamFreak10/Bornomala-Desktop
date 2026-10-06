import { apiClient } from '@/lib/api-client';
import type {
  Department,
  CreateBookPayload,
  CreateCoursePayload,
  Book,
  Course,
} from './types';

/** GET /book → nested dept/sem/course/books */
export async function fetchBooks(): Promise<Department[]> {
  const res = await apiClient.get('/book');
  const departments = res.data.data as Department[];
  return departments.map((dept) => ({
    ...dept,
    semesters: [...(dept.semesters ?? [])].sort(
      (a, b) => a.semesterNumber - b.semesterNumber
    ),
  }));
}

/** POST /courses — create a subject under a semester (admin) */
export async function createCourse(payload: CreateCoursePayload): Promise<Course> {
  const res = await apiClient.post('/courses', payload);
  const data = res.data.data;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    courseCode: row.courseCode,
    courseName: row.courseName,
    books: [],
  };
}

/** POST /book/create-book — multipart with cover image file */
export async function createBook(payload: CreateBookPayload): Promise<Book> {
  const form = new FormData();
  form.append('dept', payload.dept);
  form.append('sem', String(payload.sem));
  form.append('cc', payload.courseCode);
  form.append('bookName', payload.bookName);
  form.append('authorName', payload.authorName);
  form.append('price', String(payload.price));
  form.append('quantity', String(payload.quantity));
  if (payload.coverFile) {
    form.append('file', payload.coverFile);
  }
  const res = await apiClient.post('/book/create-book', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data as Book;
}

/** DELETE /book/:id */
export async function deleteBook(bookId: number): Promise<void> {
  await apiClient.delete(`/book/${bookId}`);
}

/** PATCH /book/:id — partial update (price, quantity, discount) */
export async function updateBook(
  bookId: number,
  data: Partial<Pick<Book, 'bookName' | 'authorName' | 'price' | 'quantity' | 'has_discount' | 'disCountPrice'>>
): Promise<Book> {
  const res = await apiClient.patch(`/book/${bookId}`, data);
  return res.data.data as Book;
}
