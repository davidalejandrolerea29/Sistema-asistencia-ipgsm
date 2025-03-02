export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          course: number
          division: string
          dni: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          course: number
          division: string
          dni: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          course?: number
          division?: string
          dni?: string
          created_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          student_id: string
          date: string
          present: boolean
          time: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          date: string
          present: boolean
          time: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          date?: string
          present?: boolean
          time?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}