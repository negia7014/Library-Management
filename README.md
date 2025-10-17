
# Library Management System

Library Management System (A full-stack Library Management System )built for a technical assessment.
This system allows management of books, members, and user roles, along with a complete workflow for issuing and returning books

## Features

### Authentication & Authorization

* Secure login system using **JWT(JSON WEB TOKEN)**.
* Role-based access control (**Admin vs User**).

### Maintenance Module (Admin only)

* Add, update, and view books.
* Add, update, and view memberships.
* Add and view system users with password hashing (**bcryptjs**).

### Transactions Module(for both user and admin)

* Public book search functionality.
* Secure workflow for issuing a book to a member.
* Book return workflow, including automated fine calculation for overdue items.

### Reports Module (Both use and Admin)

* View all currently overdue books.

---

## Tech stack

* **Backend:** Node.js, Expressjs
* **Database:** MongoDB (Mongoose)
* **Auth:**  JSON Web Tokens (JWT)
* **Frontend:** React Js (Vite)
* **Encryption:** bcryptjs
* **Dev Tools:**  nodemon

---

**GitHub:** [https://github.com/negia7014](https://github.com/negia7014)
**Email:** [add-your-email@example.com](mailto:add-your-email@example.com)
