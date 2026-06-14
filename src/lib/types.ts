export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string | null; created_at: string; updated_at: string };
        Insert: { id: string; email: string; full_name?: string | null };
        Update: { full_name?: string | null };
        Relationships: [];
      };
      lessons: {
        Row: { id: string; title: string; description: string | null; content: string | null; class_level: string | null; duration_minutes: number | null; tags: string[]; published: boolean; price: number; created_at: string; updated_at: string };
        Insert: { title: string; description?: string | null; content?: string | null; class_level?: string | null; duration_minutes?: number | null; tags?: string[]; published?: boolean; price?: number };
        Update: { title?: string; description?: string | null; content?: string | null; class_level?: string | null; duration_minutes?: number | null; tags?: string[]; published?: boolean; price?: number };
        Relationships: [];
      };
      exercises: {
        Row: { id: string; title: string; type: string; questions: string; correct_answers: string; class_level: string | null; published: boolean; price: number; created_at: string };
        Insert: { title: string; type: string; questions: string; correct_answers: string; class_level?: string | null; published?: boolean; price?: number };
        Update: { title?: string; type?: string; questions?: string; correct_answers?: string; class_level?: string | null; published?: boolean; price?: number };
        Relationships: [];
      };
      resources: {
        Row: { id: string; title: string; description: string | null; file_url: string; file_type: string; file_size: number | null; class_level: string | null; tags: string[]; published: boolean; price: number; created_at: string };
        Insert: { title: string; description?: string | null; file_url: string; file_type: string; file_size?: number | null; class_level?: string | null; tags?: string[]; published?: boolean; price?: number };
        Update: { title?: string; description?: string | null; file_url?: string; file_type?: string; file_size?: number | null; class_level?: string | null; tags?: string[]; published?: boolean; price?: number };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
