export type Game = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  play_url: string;
  category: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}; 