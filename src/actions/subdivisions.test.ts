import { supabaseServer } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

import {
  getSubdivisions,
  createSubdivision,
  updateSubdivisionsOrder,
} from '@/actions/subdivisions';

jest.mock('@/lib/supabase-server', () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const MOCK_LANGUAGE_ID = 'lang-1';

const MOCK_SUBDIVISION_ROW = {
  id: 's1',
  name: 'Name',
  slug: 'slug-1',
  description: 'desc',
  site_url: null,
  image_url: { publicId: 'p', secureUrl: 'https://img' },
  hover_image_url: null,
  hover_name: null,
  hover_description: null,
  is_active: true,
  sort_order: 1,
  updated_at: '2020-01-01',
  language_id: MOCK_LANGUAGE_ID,
};

const MOCK_INSERTED_ROW = {
  id: 's2',
  name: 'New',
  slug: 'new',
  description: 'd',
  site_url: null,
  image_url: null,
  hover_image_url: null,
  hover_name: null,
  hover_description: null,
  is_active: true,
  sort_order: 2,
  updated_at: '2020-01-02',
  language_id: MOCK_LANGUAGE_ID,
};

const MOCK_CREATE_PAYLOAD = {
  name: 'New',
  slug: 'new',
  description: 'd',
  siteUrl: null,
  imageUrl: null,
  hoverImageUrl: null,
  hoverName: null,
  hoverDescription: null,
  isActive: true,
  sortOrder: 2,
  languageCode: 'uk' as const,
};

describe('subdivisions actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSubdivisions', () => {
    it('returns mapped subdivisions for locale', async () => {
      const languageChain = createLanguageChain();
      const subdivisionChain = createSubdivisionChain('order', [MOCK_SUBDIVISION_ROW]);

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        switch (table) {
          case 'language':
            return languageChain;
          case 'subdivision':
            return subdivisionChain;
          default:
            return {} as any;
        }
      });

      const result = await getSubdivisions('uk' as any);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(MOCK_SUBDIVISION_ROW.id);
      expect(result[0].imageUrl).toEqual(MOCK_SUBDIVISION_ROW.image_url);
    });
  });

  describe('createSubdivision', () => {
    it('inserts and calls revalidatePath', async () => {
      const languageChain = createLanguageChain();
      const insertChain: any = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: MOCK_INSERTED_ROW, error: null }),
      };

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        switch (table) {
          case 'language':
            return languageChain;
          case 'subdivision':
            return insertChain;
          default:
            return {} as any;
        }
      });

      const created = await createSubdivision(MOCK_CREATE_PAYLOAD as any);

      expect(created.id).toBe(MOCK_INSERTED_ROW.id);
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('updateSubdivisionsOrder', () => {
    it('updates items and calls revalidatePath', async () => {
      const updateResult = Promise.resolve({ error: null });

      (supabaseServer.from as jest.Mock).mockImplementation(() => ({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(updateResult),
        }),
      }));

      await updateSubdivisionsOrder([
        { id: 'a', sortOrder: 1 },
        { id: 'b', sortOrder: 2 },
      ]);

      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });
});

function createLanguageChain(returnData: any = { id: MOCK_LANGUAGE_ID }) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: returnData, error: null }),
  };
}

function createSubdivisionChain(method: 'order' | 'single', data: any) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    [method]: jest.fn().mockResolvedValue({ data, error: null }),
  };
}
