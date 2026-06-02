import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session.service';
import { uploadImage, deleteImage } from '@/lib/admin/upload-image.service';

import { uploadImageAction, deleteImageAction } from '@/actions/admin/upload-image.actions';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/auth/session.service', () => ({
  verifySession: jest.fn(),
}));

jest.mock('@/lib/admin/upload-image.service', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}));

const MOCK_STORED_IMAGE = { publicId: 'p', secureUrl: 'https://img' };
const MOCK_FILE = {} as File;
const MOCK_FILE_NAME = 'f.png';
const MOCK_PUBLIC_ID = 'publicId';

describe('upload-image actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImageAction', () => {
    it('returns success when session valid and upload succeeds', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: jest.fn(() => ({ value: 'token' })),
      });
      (verifySession as jest.Mock).mockResolvedValue(true);
      (uploadImage as jest.Mock).mockResolvedValue(MOCK_STORED_IMAGE);

      const result = await uploadImageAction({
        file: MOCK_FILE,
        fileName: MOCK_FILE_NAME,
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('data');
    });

    it('returns error when session invalid', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: jest.fn(() => undefined),
      });
      (verifySession as jest.Mock).mockReturnValue(false);

      const result = await uploadImageAction({
        file: MOCK_FILE,
        fileName: MOCK_FILE_NAME,
      });

      expect(result.success).toBe(false);
      if ('error' in result) {
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('deleteImageAction', () => {
    it('returns success when session valid and delete succeeds', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: jest.fn(() => ({ value: 'token' })),
      });
      (verifySession as jest.Mock).mockReturnValue(true);
      (deleteImage as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteImageAction(MOCK_PUBLIC_ID);

      expect(result.success).toBe(true);
    });

    it('returns error when session invalid', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: jest.fn(() => undefined),
      });
      (verifySession as jest.Mock).mockReturnValue(false);

      const result = await deleteImageAction(MOCK_PUBLIC_ID);

      expect(result.success).toBe(false);
      if ('error' in result) {
        expect(typeof result.error).toBe('string');
      }
    });
  });
});

