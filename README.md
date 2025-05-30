# BillMate - Smart Bill Management System

BillMate is a comprehensive bill management application that helps users track, manage, and analyze their bills efficiently.

## Features

- User authentication and authorization
- Bill creation and management
- Bill categorization and tagging
- Payment tracking and reminders
- Analytics and reporting
- Mobile-responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- Jest and React Testing Library for testing

### Backend
- Python FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- Pytest for testing
- REST Assured for API testing

### DevOps
- GitHub Actions for CI/CD
- Docker for containerization
- Git for version control

## Project Structure

```
billmate/
├── frontend/           # React frontend application
├── backend/           # FastAPI backend application
├── tests/            # Integration and E2E tests
└── docs/             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/billmate.git
cd billmate
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Start the development servers:
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm start
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
