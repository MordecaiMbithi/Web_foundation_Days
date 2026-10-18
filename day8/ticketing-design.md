# TicketHub System Architecture & Design Document

TicketHub is a high-concurrency event ticketing platform that allows users to discover events, select reserved seats, place temporary holds, and purchase tickets securely during extreme flash-sale traffic spikes.

---

## 1. System Requirements

### Functional Requirements
* **Event Discovery:** Users can browse, search, and view event schedules and venue layouts.
* **Seat Map & Real-Time Availability:** Users can inspect a venue seat map and see which seats are available, reserved, or held.
* **Seat Reservation / Holding:** Users can place a temporary hold on up to 4 selected seats for 10 minutes while checking out.
* **Checkout & Payment:** Users can securely enter payment details; upon payment confirmation, the hold converts to an issued ticket order.
* **Ticket Management:** Users can view purchased tickets with verifiable QR/barcodes in their account.

### Non-Functional Requirements
* **Correctness (Zero Double-Booking):** Under no circumstance may two users purchase or hold the same physical seat for the same event ($100\%$ inventory integrity).
* **High Availability & Fault Tolerance:** The browsing and payment system must maintain $99.99\%$ uptime, especially during high-demand on-sale launches.
* **Speed / Low Latency:** Seat map viewing and event browsing must respond in $< 200\text{ ms}$. Hold attempts must resolve in $< 500\text{ ms}$.
* **Fairness:** Seats are distributed on a strict First-Come, First-Served (FCFS) basis. An intake virtual waiting room must throttle and queue requests fairly to protect downstream checkout systems and prevent automated bot scraping.

---

## 2. Capacity Estimates & Traffic Analysis

### Baseline Assumptions
* **Registered User Base:** 2,000,000 users.
* **Normal Traffic Day:** 50,000 daily visitors viewing 10 pages each; 5,000 tickets sold across 24 hours (86,400 seconds).
* **Big Sale Peak:** 200,000 concurrent users attempting to secure 20,000 available seats within the first 10 minutes (600 seconds).

---

### Traffic Comparison

| Metric | Normal Day Traffic | Big Concert On-Sale Peak (First 10 min) | Spike Factor |
|---|---|---|---|
| **Page Views / Day or Window** | $500{,}000\text{ views/day}$ | $200{,}000 \times 15 = 3{,}000{,}000\text{ views/10 min}$ | **$51.8\times$ intensity** |
| **Average Read QPS** | $\frac{500{,}000}{86{,}400} \approx \mathbf{5.8\text{ RPS}}$ | $\frac{3{,}000{,}000}{600} = \mathbf{5{,}000\text{ RPS}}$ | **$862\times$ baseline** |
| **Peak Read QPS (2× factor)** | $\approx \mathbf{11.6\text{ RPS}}$ | $\approx \mathbf{10{,}000\text{ RPS}}$ | **$862\times$ baseline** |
| **Ticket Reservation / Write QPS** | $\frac{5{,}000}{86{,}400} \approx \mathbf{0.06\text{ write RPS}}$ | $\frac{200{,}000\text{ attempts}}{600} \approx \mathbf{333.3\text{ write RPS}}$ | **$5{,}555\times$ baseline** |
| **Successful Writes (Sold)** | 5,000 tickets/day | 20,000 tickets in 10 minutes | **$34.5\times$ baseline** |

### Traffic Analysis
During a major sale, read traffic surges by roughly **$860\times$**, while write contention skyrockets by over **$5{,}500\times$**. Because 200,000 users compete for only 20,000 seats, over $90\%$ of reservation attempts will ultimately fail or be queued. The system cannot let 10,000 peak requests per second strike the relational database directly; aggressive caching, edge token verification, and a virtual queue must absorb the bulk of incoming requests.

---

## 3. REST API Design

### 1. List Events
* **Method & Path:** `GET /api/v1/events`
* **Description:** Returns paginated list of upcoming active events with filters (date, city, genre).
* **Response Code:** `200 OK`

### 2. View Event Seat Map & Availability
* **Method & Path:** `GET /api/v1/events/:eventId/seats`
* **Description:** Retrieves seat map layout and availability status (`available`, `held`, `sold`) for a specific event.
* **Response Code:** `200 OK`

### 3. Hold Selected Seats
* **Method & Path:** `POST /api/v1/events/:eventId/holds`
* **Description:** Places a 10-minute hold on selected seats for the authenticated user.
* **Request Body:**
```json
{
  "seatIds": [101, 102],
  "idempotencyKey": "a98c8f8b-e854-46b7-84bc-56a9080c98f1"
}