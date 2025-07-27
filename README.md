
# ExamNest Frontend 🚀

Welcome to the official frontend repository for **ExamNest**, a modern, full-featured online examination platform. This Angular application provides a seamless and interactive user interface for students, instructors, and administrators to manage and participate in online exams.



## ✨ Key Features

This application is designed with a role-based architecture, offering tailored experiences for each user type.

### 🎓 For Students
*   **Intuitive Dashboard:** A personalized dashboard to view upcoming exams and past results.
*   **Seamless Exam Experience:** A distraction-free environment for taking exams with a live timer.
*   **Instant Results:** View detailed performance, scores, and answer breakdowns immediately after submission.
*   **Secure Exam Entry:** Simple and secure access to exams using unique IDs.

### 👨‍🏫 For Instructors
*   **Comprehensive Dashboard:** Get an at-a-glance overview of key statistics like total exams, active courses, student count, and recent submissions.
*   **Exam Management:** Full CRUD functionality to create, schedule, and manage exams.
*   **Question Bank:** A centralized repository to create, edit, and manage questions of various types (MCQ, True/False, Essay) and their choices.
*   **Student & Course Management:** Easily manage student assignments to tracks/branches and oversee course curriculum.

### ⚙️ For Administrators
*   **System-Wide Analytics:** A powerful admin dashboard with insights into user roles, registrations, and system content (branches, tracks, courses).
*   **User Management:** Manage all users in the system, with capabilities to upgrade user roles and assign them to different branches or tracks.
*   **Branch & Track Management:** Full control over creating and managing the foundational structure of branches and learning tracks.

### 🛡️ Core Features
*   **Secure Authentication:** JWT-based authentication with automatic token refresh to ensure secure and persistent sessions.
*   **Role-Based Access Control (RBAC):** Guards and interceptors protect routes and features based on user roles (Student, Instructor, Admin).
*   **Responsive Design:** A fully responsive and mobile-friendly interface built with Tailwind CSS.
*   **Modern UI:** A rich user experience powered by the PrimeNG component library.
*   **Robust API Integration:** A complete service layer that handles all communication with the backend, featuring consistent error handling and type-safety.

## 🛠️ Tech Stack

This project is built with a modern and powerful set of technologies:

*   **Framework:** [Angular](https://angular.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [PrimeNG](https://primeng.org/)
*   **State Management:** [RxJS](https://rxjs.dev/)
*   **Charting:** [Chart.js](https://www.chartjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Authentication:** [JWT-Decode](https://github.com/auth0/jwt-decode)
*   **HTTP Client:** Angular's built-in HttpClient with Interceptors

## 📂 Project Structure

The project follows a feature-based architecture for scalability and maintainability.

```
gitnasr-examnest-frontend/
└── src/
    └── app/
        ├── features/
        │   ├── admin/      # Admin-specific components and routes
        │   ├── auth/       # Login and registration
        │   ├── instructor/ # Instructor-specific components and routes
        │   ├── landing/    # The public landing page
        │   └── student/    # Student-specific components and routes
        └── shared/
            ├── components/ # Reusable components (NavBar, Header)
            ├── guards/     # Auth and Role guards for route protection
            ├── interceptors/ # HTTP interceptors for auth and token refresh
            ├── interfaces/ # TypeScript interfaces for API contracts
            └── services/   # Core services for API communication
```

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18.x or later)
*   Angular CLI (`npm install -g @angular/cli`)
*   A running instance of the [ExamNest Backend](https://github.com/example/examnest-backend) service.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/gitnasr-examnest-frontend.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd gitnasr-examnest-frontend
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Update the API Base URL:**
    Open `src/app/shared/services/api.service.ts` and ensure the `API_BASE_URL` points to your running backend instance.
    ```typescript
    private readonly API_BASE_URL = 'https://localhost:7238/api';
    ```

5.  **Run the development server:**
    ```sh
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build for Production

To create a production-ready build, run:
```sh
ng build --configuration production
```
The build artifacts will be stored in the `dist/` directory.
