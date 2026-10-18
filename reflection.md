```markdown
# Web Foundations & Systems Capstone Reflection

### 1. Most Difficult Concept & How I Overcame It
The most challenging concept in this course was mastering database concurrency and transactional consistency under high-load scenarios. Specifically, understanding the subtle differences between optimistic concurrency control and pessimistic row-level locking (`SELECT ... FOR UPDATE`) was difficult to grasp purely in theory. I struggled with understanding why optimistic locking collapses during extreme flash sales until I simulated concurrent updates in SQLite and analyzed transaction lock contentions. Reading through relational ACID guarantees, building step-by-step transaction scripts, and testing edge cases—such as race conditions where two threads attempt to claim the same seat ID—helped solidify how relational engines serialize mutations and why isolating writes is essential for data integrity.

### 2. Capstone Improvement Based on Feedback
Based on technical feedback received on my earlier architectural plans, I would improve the feed invalidation and caching strategy in the Day 7 SnapShare capstone. My initial design relied heavily on simple write fan-out (pushing posts to every follower's timeline cache immediately). Reviewers pointed out that this causes severe latency spikes when high-profile accounts ("celebrities") upload photos. In a future revision, I would implement a hybrid feed model: standard accounts use fan-out on write, while accounts with over 20,000 followers use fan-out on read (pull model), dynamically merging their uploads into user timelines on demand to prevent write amplification.

### 3. What I Will Learn Next
Moving forward, I plan to dive deeper into backend systems engineering, specifically focusing on building production-grade microservices with Node.js/Go and working hands-on with distributed streaming platforms like Apache Kafka and Redis Pub/Sub. I also want to explore containerization with Docker and Kubernetes to build, deploy, and monitor scalable cloud-native architectures that automatically recover from node failures.
How to Create and Push in VS Code Terminal