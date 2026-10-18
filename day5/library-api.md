# Library Books REST API Design

A RESTful specification for managing a library's `books` resource.

---

## Endpoints

### 1. List All Books
* **Method:** `GET`
* **Path:** `/api/v1/books`
* **Description:** Retrieves an array of all book objects in the library catalog.
* **Success Status Code:** `200 OK`

---

### 2. Get One Book
* **Method:** `GET`
* **Path:** `/api/v1/books/:id`
* **Description:** Retrieves the complete details of a specific book by its unique ID.
* **Success Status Code:** `200 OK`

---

### 3. Create a Book
* **Method:** `POST`
* **Path:** `/api/v1/books`
* **Description:** Adds a new book to the catalog and returns the created record.
* **Request Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "publishedYear": 2008,
  "copiesAvailable": 4
}