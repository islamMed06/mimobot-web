export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "teacher" | "student";
          class_level: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "teacher" | "student";
          class_level?: string | null;
        };
        Update: {
          full_name?: string | null;
          role?: "teacher" | "student";
          class_level?: string | null;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          content: string | null;
          class_level: string | null;
          duration_minutes: number | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          teacher_id: string;
          title: string;
          description?: string | null;
          content?: string | null;
          class_level?: string | null;
          duration_minutes?: number | null;
          tags?: string[];
        };
        Update: {
          title?: string;
          description?: string | null;
          content?: string | null;
          class_level?: string | null;
          duration_minutes?: number | null;
          tags?: string[];
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          teacher_id: string;
          lesson_id: string | null;
          title: string;
          type: "multiple_choice" | "fill_blank" | "matching" | "writing";
          questions: string;
          correct_answers: string;
          class_level: string | null;
          created_at: string;
        };
        Insert: {
          teacher_id: string;
          lesson_id?: string | null;
          title: string;
          type: "multiple_choice" | "fill_blank" | "matching" | "writing";
          questions: string;
          correct_answers: string;
          class_level?: string | null;
        };
        Update: {
          title?: string;
          type?: "multiple_choice" | "fill_blank" | "matching" | "writing";
          questions?: string;
          correct_answers?: string;
          class_level?: string | null;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          file_size: number | null;
          class_level: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          teacher_id: string;
          title: string;
          description?: string | null;
          file_url: string;
          file_type: string;
          file_size?: number | null;
          class_level?: string | null;
          tags?: string[];
        };
        Update: {
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string;
          file_size?: number | null;
          class_level?: string | null;
          tags?: string[];
        };
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
