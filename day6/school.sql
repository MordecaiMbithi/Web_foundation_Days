-- Enable foreign key constraint enforcement in SQLite
PRAGMA foreign_keys = ON;

-- Clean up existing tables if re-running
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. Table Definitions
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0)
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D', 'F', 'Pending')),
    enrolment_date TEXT NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE RESTRICT,
    UNIQUE (student_id, course_id) -- Prevents duplicate enrolments
);

-- 2. Sample Data Insertion

-- 4 Students (including one without enrolments to test queries)
INSERT INTO students (first_name, last_name, email) VALUES
('Alice', 'Johnson', 'alice.johnson@example.com'),
('Bob', 'Smith', 'bob.smith@example.com'),
('Charlie', 'Brown', 'charlie.brown@example.com'),
('Diana', 'Prince', 'diana.prince@example.com');

-- 3 Courses
INSERT INTO courses (course_code, title, credits) VALUES
('CS101', 'Intro to Computer Science', 3),
('MATH201', 'Linear Algebra', 4),
('WEB102', 'Web Development Foundations', 3);

-- 5 Enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),        -- Alice in CS101
(1, 2, 'B'),        -- Alice in MATH201
(2, 1, 'C'),        -- Bob in CS101
(2, 3, 'Pending'),  -- Bob in WEB102
(3, 3, 'A');        -- Charlie in WEB102
-- Note: Diana (ID 4) has no enrolments

-- 3. Five Required Queries

-- Query 1: All courses for one student by name ('Alice Johnson')
SELECT 
    s.first_name || ' ' || s.last_name AS student_name,
    c.course_code,
    c.title AS course_title,
    c.credits,
    e.grade
FROM enrolments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.first_name = 'Alice' AND s.last_name = 'Johnson';

-- Query 2: All students on one course ('Intro to Computer Science')
SELECT 
    c.course_code,
    c.title AS course_title,
    s.student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    s.email,
    e.grade
FROM enrolments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE c.title = 'Intro to Computer Science';

-- Query 3: The number of students per course (includes courses with 0 students)
SELECT 
    c.course_code,
    c.title,
    COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_code, c.title
ORDER BY student_count DESC;

-- Query 4: Students who have no enrolments
SELECT 
    s.student_id,
    s.first_name,
    s.last_name,
    s.email
FROM students s
LEFT JOIN enrolments e ON s.student_id = e.student_id
WHERE e.enrolment_id IS NULL;

-- Query 5: Update one enrolment's grade (updating Bob's pending grade in WEB102 to 'A')
UPDATE enrolments
SET grade = 'A'
WHERE student_id = (SELECT student_id FROM students WHERE email = 'bob.smith@example.com')
  AND course_id = (SELECT course_id FROM courses WHERE course_code = 'WEB102');

-- Verify the update
SELECT 
    s.first_name || ' ' || s.last_name AS student_name,
    c.course_code,
    e.grade
FROM enrolments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.email = 'bob.smith@example.com' AND c.course_code = 'WEB102';