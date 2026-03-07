import { sendSuccess, sendPaginated, sendError } from '../../utils/response';

// Create a mock Response object
function createMockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('sendSuccess', () => {
  it('sends data with 200 status by default', () => {
    const res = createMockRes();
    sendSuccess(res, { foo: 'bar' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { foo: 'bar' },
    });
  });

  it('sends with custom status code', () => {
    const res = createMockRes();
    sendSuccess(res, { id: '1' }, 'Created', 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: '1' },
      message: 'Created',
    });
  });

  it('sends null data', () => {
    const res = createMockRes();
    sendSuccess(res, null, 'Deleted');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: null,
      message: 'Deleted',
    });
  });
});

describe('sendPaginated', () => {
  it('sends paginated response with calculated totalPages', () => {
    const res = createMockRes();
    sendPaginated(res, [{ id: '1' }], { page: 1, limit: 10, total: 25 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ id: '1' }],
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });
  });

  it('calculates totalPages correctly for exact divisor', () => {
    const res = createMockRes();
    sendPaginated(res, [], { page: 1, limit: 10, total: 30 });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: expect.objectContaining({ totalPages: 3 }),
      })
    );
  });

  it('handles zero total', () => {
    const res = createMockRes();
    sendPaginated(res, [], { page: 1, limit: 10, total: 0 });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: expect.objectContaining({ totalPages: 0, total: 0 }),
      })
    );
  });
});

describe('sendError', () => {
  it('sends error with 400 status by default', () => {
    const res = createMockRes();
    sendError(res, 'Something went wrong');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Something went wrong',
    });
  });

  it('sends error with custom status code', () => {
    const res = createMockRes();
    sendError(res, 'Not found', 404);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not found',
    });
  });

  it('sends 500 error', () => {
    const res = createMockRes();
    sendError(res, 'Internal server error', 500);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
