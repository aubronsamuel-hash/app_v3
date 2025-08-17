import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, expect, test, type Mock } from 'vitest';
import { ReactNode } from 'react';
import { useMissionsList } from '../useMissions';
import { http } from '../../lib/http';

vi.mock('../../lib/http', () => ({
  http: vi.fn(),
}));

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

test('fetch missions list', async () => {
  const data = { items: [], total: 0, page: 1, pageSize: 10 };
  (http as unknown as Mock).mockResolvedValueOnce(data);
  const wrapper = createWrapper();
  const { result } = renderHook(() => useMissionsList({ page: 1 }), { wrapper });
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  expect(result.current.data).toEqual(data);
});

test('handles error', async () => {
  (http as unknown as Mock).mockRejectedValueOnce(new Error('fail'));
  const wrapper = createWrapper();
  const { result } = renderHook(() => useMissionsList({ page: 1 }), { wrapper });
  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });
  expect(result.current.error).toBeTruthy();
});
