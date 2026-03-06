export function parsePagination(page?: string, limit?: string) {
  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20', 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
}
