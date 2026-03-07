import { parsePagination } from '../../utils/pagination';

describe('parsePagination', () => {
  it('returns defaults when no params provided', () => {
    const result = parsePagination();
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });

  it('parses valid page and limit', () => {
    const result = parsePagination('3', '10');
    expect(result).toEqual({ page: 3, limit: 10, skip: 20 });
  });

  it('clamps page to minimum of 1', () => {
    const result = parsePagination('0', '10');
    expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('clamps negative page to 1', () => {
    const result = parsePagination('-5', '10');
    expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('clamps limit to maximum of 100', () => {
    const result = parsePagination('1', '500');
    expect(result).toEqual({ page: 1, limit: 100, skip: 0 });
  });

  it('clamps limit to minimum of 1', () => {
    const result = parsePagination('1', '0');
    expect(result).toEqual({ page: 1, limit: 1, skip: 0 });
  });

  it('handles non-numeric strings gracefully', () => {
    const result = parsePagination('abc', 'xyz');
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });

  it('calculates skip correctly for page 5 with limit 25', () => {
    const result = parsePagination('5', '25');
    expect(result).toEqual({ page: 5, limit: 25, skip: 100 });
  });
});
