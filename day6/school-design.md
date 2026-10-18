# School Database System Design

## 1. Table Explanations

* **`students`**: Stores core biographical details for each enrolled learner. It tracks their unique system identifier (`student_id`), name, mandatory unique contact address (`email`), and registration timestamp.
* **`courses`**: Represents the academic offerings available in the institution. Each entry contains a unique course code (`course_code`, e.g., CS101), descriptive title, and non-negative credit weighting.
* **`enrolments`**: Serves as the associative entity that links students to the specific classes they attend. It captures enrollment metadata, specifically the date of registration and current letter grade.

---

## 2. Relationships & Join Table Justification

* **Many-to-Many Relationship**: The relationship between `students` and `courses` is inherently many-to-many ($M:N$). A single student can register for multiple courses throughout a term, and an individual course accommodates many students simultaneously.
* **Role of the Join Table**: Relational databases cannot directly store arrays or multi-value associations inside atomic columns without violating First Normal Form (1NF). The `enrolments` table resolves this many-to-many relationship into two distinct one-to-many ($1:N$) relationships:
  * One student has many enrolments (`students.student_id` $\rightarrow$ `enrolments.student_id`).
  * One course has many enrolments (`courses.course_id` $\rightarrow$ `enrolments.course_id`).
  Furthermore, the join table provides a natural storage location for attributes that belong strictly to the relationship itself rather than either entity alone, such as the `grade` earned and the `enrolment_date`. A composite `UNIQUE (student_id, course_id)` constraint prevents duplicate records for the same student-course pair.

---

## 3. Recommended Index

```sql
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);