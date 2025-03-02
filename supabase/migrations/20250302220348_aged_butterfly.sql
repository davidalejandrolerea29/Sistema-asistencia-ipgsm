/*
  # Create initial schema for student attendance system

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `course` (integer)
      - `division` (text)
      - `dni` (text, unique)
      - `created_at` (timestamp)
    - `attendance_records`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students.id)
      - `date` (date)
      - `present` (boolean)
      - `time` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  course integer NOT NULL,
  division text NOT NULL,
  dni text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  present boolean NOT NULL,
  time text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_students_course_division ON students(course, division);
CREATE INDEX IF NOT EXISTS idx_students_dni ON students(dni);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Anyone can read students"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete students"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for attendance_records table
CREATE POLICY "Anyone can read attendance_records"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert attendance_records"
  ON attendance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update attendance_records"
  ON attendance_records
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete attendance_records"
  ON attendance_records
  FOR DELETE
  TO authenticated
  USING (true);