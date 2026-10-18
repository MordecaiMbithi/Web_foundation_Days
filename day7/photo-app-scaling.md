# SnapShare System Scaling Plan

SnapShare is a photo-sharing application where registered users upload photos and scroll through an aggregated timeline feed of content posted by users they follow.

---

## 1. Baseline Assumptions & Traffic Estimations

### Baseline Assumptions
* **Total Registered Users:** 10,000,000
* **Daily Active Users (DAU):** 10% of registered users = 1,000,000 active users/day
* **Uploads per Active User:** 1 photo/day
* **Feed Page Views per Active User:** 50 feed views/day
* **File Sizes:** Average original photo = 2 MB; generated thumbnail = 50 KB (0.05 MB); total stored per upload = 2.05 MB
* **Daily Timeframe:** 86,400 seconds/day (approximated to 86,400 seconds for rate conversions)

---

### Quantitative Estimations

#### 1. Uploads per Second (Write Traffic)
$$\text{Total Daily Uploads} = 1{,}000{,}000 \times 1 = 1{,}000{,}000\text{ uploads/day}$$
$$\text{Average Uploads/sec} = \frac{1{,}000{,}000}{86{,}400} \approx 11.57\text{ uploads/second}$$
* *Peak Write Estimate (assumes a 2× peak factor):* $\approx 23.1\text{ uploads/second}$

#### 2. Feed Views per Second (Read Traffic)
$$\text{Total Daily Feed Views} = 1{,}000{,}000 \times 50 = 50{,}000{,}000\text{ views/day}$$
$$\text{Average Feed Views/sec} = \frac{50{,}000{,}000}{86{,}400} \approx 578.70\text{ feed views/second}$$
* *Peak Read Estimate (assumes a 2× peak factor):* $\approx 1{,}157.4\text{ views/second}$

#### 3. Storage per Year
$$\text{Storage per Upload} = 2.0\text{ MB (original)} + 0.05\text{ MB (thumbnail)} = 2.05\text{ MB}$$
$$\text{Daily Storage Required} = 1{,}000{,}000\text{ uploads} \times 2.05\text{ MB} = 2{,}050{,}000\text{ MB} = 2.05\text{ TB/day}$$
$$\text{Annual Storage Required} = 2.05\text{ TB/day} \times 365\text{ days} = 748.25\text{ TB/year}$$

---

## 2. Traffic Classification: Read-Heavy vs. Write-Heavy

SnapShare is definitively a **read-heavy system**. 

The ratio of feed views to uploads is **50:1** (578.7 reads/sec vs. 11.57 writes/sec). Because query load outweighs write mutations by a factor of 50, system optimization must prioritize edge caching, feed caching layers, and database read-replicas over write-sharding optimizations.

---

## 3. High-Level Architecture Diagram

```text
                  +--------------------------------+
                  |           Client               |
                  |     (Mobile / Web App)         |
                  +---------------+----------------+
                                  |
                                  v
                  +--------------------------------+
                  |     Content Delivery Network   | <--- Static Images &
                  |             (CDN)              |      Thumbnails
                  +---------------+----------------+
                                  |
                                  v
                  +--------------------------------+
                  |         Load Balancer          |
                  +---------------+----------------+
                                  |
          +-----------------------+-----------------------+
          |                                               |
          v                                               v
+-------------------+                           +-------------------+
|    App Server     |                           |    App Server     |
|    Instance 1     |                           |    Instance 2     |
+---------+---------+                           +---------+---------+
          |                                               |
          +-----------------------+-----------------------+
                                  |
         +------------------------+-----------------------+
         |                        |                       |
         v                        v                       v
+------------------+    +------------------+    +-------------------+
|  Primary DB      |    |  In-Memory Cache |    |   Object Storage  |
|  (SQL Writes)    |    |  (Redis/Memcache)|    |  (e.g., S3 Bucket)|
+--------+---------+    +------------------+    +---------+---------+
         |                                                |
         v (Replication)                                  v
+------------------+                            +-------------------+
|  Read Replica DB |                            |  Message Queue    |
|  (SQL Reads)     |                            |  (e.g., SQS/Kafka)|
+------------------+                            +---------+---------+
                                                          |
                                                          v
                                                +-------------------+
                                                | Background Worker |
                                                | (Image Resizing)  |
                                                +-------------------+