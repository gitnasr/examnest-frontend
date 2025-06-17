# ExamNest API Integration

This directory contains all the services for integrating with the ExamNest API. The services are organized by functionality and follow a consistent pattern for error handling and response mapping.

## Service Architecture

### Core Services

- **ApiService**: Base HTTP service that handles all API communication, error handling, and token management
- **AuthService**: Handles authentication, token refresh, and user session management
- **UserService**: Manages user profile operations

### Entity Services

- **BranchService**: Manages branch operations (CRUD)
- **TrackService**: Manages track operations (CRUD)
- **CourseService**: Manages course operations (CRUD)
- **QuestionBankService**: Manages question bank operations (CRUD)
- **ChoiceService**: Manages choice operations (CRUD)

### User Management Services

- **StudentService**: Manages student operations (CRUD)
- **InstructorService**: Manages instructor operations (CRUD)
- **ManagementService**: Handles user role upgrades and management operations

### Exam Services

- **ExamService**: Manages exam operations (CRUD, display, results)
- **SubmissionService**: Manages exam submissions (CRUD, details)

## Usage Examples

### Authentication

```typescript
import { AuthService } from '@shared/services';

// Login
this.authService.login({ email: 'user@example.com', password: 'password' })
  .subscribe({
    next: (response) => console.log('Login successful', response),
    error: (error) => console.error('Login failed', error)
  });

// Register
this.authService.register({ 
  email: 'user@example.com', 
  password: 'password', 
  name: 'John Doe' 
})
  .subscribe({
    next: (response) => console.log('Registration successful', response),
    error: (error) => console.error('Registration failed', error)
  });
```

### Entity Operations

```typescript
import { BranchService, TrackService, CourseService } from '@shared/services';

// Get branches (returns array, not paginated)
this.branchService.getBranches(1)
  .subscribe({
    next: (branches) => console.log('Branches:', branches),
    error: (error) => console.error('Failed to fetch branches', error)
  });

// Create a new track
this.trackService.createTrack({ 
  branchId: 1, 
  trackName: 'Web Development' 
})
  .subscribe({
    next: (track) => console.log('Track created:', track),
    error: (error) => console.error('Failed to create track', error)
  });
```

### Exam Operations

```typescript
import { ExamService, SubmissionService } from '@shared/services';

// Get exams (returns array, not paginated)
this.examService.getExams(1)
  .subscribe({
    next: (exams) => console.log('Exams:', exams),
    error: (error) => console.error('Failed to fetch exams', error)
  });

// Create an exam
this.examService.createExam({
  courseId: 1,
  noOfQuestions: 10,
  examDate: '2024-01-15T10:00:00Z',
  endDate: '2024-01-15T12:00:00Z'
})
  .subscribe({
    next: (exam) => console.log('Exam created:', exam),
    error: (error) => console.error('Failed to create exam', error)
  });

// Submit exam answers
this.submissionService.createSubmission({
  examID: 1,
  answers: [
    { questionID: 1, studentAnswer: 'A' },
    { questionID: 2, studentAnswer: 'B' }
  ]
})
  .subscribe({
    next: (submission) => console.log('Submission created:', submission),
    error: (error) => console.error('Failed to submit exam', error)
  });
```

## Error Handling

All services include comprehensive error handling that:

1. Maps API error responses to user-friendly error messages
2. Handles HTTP status codes appropriately
3. Provides consistent error structure across all services
4. Automatically handles token refresh on 401 errors

## Response Structure

### Standard API Response
All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[] | null;
}
```

### Array Response (for list endpoints)
List endpoints return a simple array structure:

```typescript
interface ArrayResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  errors: string[] | null;
}
```

### Example Response
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "examId": 1,
      "courseId": 1,
      "courseName": "OOP",
      "noOfQuestions": 9,
      "examDate": "2025-04-28T12:55:19.793",
      "endDate": "0001-01-01T00:00:00"
    }
  ],
  "errors": null
}
```

## Authentication Flow

1. **Login/Register**: User credentials are sent to the API
2. **Token Storage**: Access and refresh tokens are stored in cookies
3. **Automatic Refresh**: The AuthService automatically refreshes tokens when they expire
4. **Logout**: Tokens are cleared from cookies and user session is terminated

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure cookie storage
- Role-based access control
- CSRF protection (handled by the API)

## API Endpoints

The services cover all API endpoints defined in the OpenAPI specification:

- **Authentication**: `/api/Authentication/*`
- **Branches**: `/api/Branches/*`
- **Tracks**: `/api/Tracks/*`
- **Courses**: `/api/Courses/*`
- **QuestionBank**: `/api/QuestionBank/*`
- **Choices**: `/api/Choices/*`
- **Exams**: `/api/Exams/*`
- **Submissions**: `/api/Submissions/*`
- **Students**: `/api/Students/*`
- **Instructors**: `/api/Instructors/*`
- **Management**: `/api/Management/*`

## Important Notes

### Response Format
- **List endpoints** (GET with page parameter) return `ArrayResponse<T>` with a simple array in the `data` field
- **Single item endpoints** (GET by ID) return `ApiResponse<T>` with a single item in the `data` field
- **Create/Update endpoints** return `ApiResponse<T>` with the created/updated item in the `data` field

### Exam Interface
The Exam interface has been updated to match the actual API response:
```typescript
interface Exam {
  examId: number;        // API uses 'examId' not 'id'
  courseId: number;
  courseName: string;    // Included in API response
  noOfQuestions: number;
  examDate: string;
  endDate: string;
  course?: Course;       // Optional for extended data
}
```

## Best Practices

1. **Always handle errors**: Use the error callback in subscriptions
2. **Check authentication**: Verify user is authenticated before making API calls
3. **Handle loading states**: Show loading indicators during API calls
4. **Validate data**: Validate input data before sending to the API
5. **Use TypeScript**: Leverage TypeScript interfaces for type safety
6. **Handle array responses**: List endpoints return arrays, not paginated objects 