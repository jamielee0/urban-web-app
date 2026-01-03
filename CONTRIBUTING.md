# Contributing to URBAN Web Application

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional)

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
URBAN_MODEL_SERVICE_URL=http://localhost:8001
```

4. Run the backend:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints
- Format with black (recommended)
- Maximum line length: 100 characters

### TypeScript/React (Frontend)
- Use TypeScript for all new files
- Follow React best practices
- Use functional components with hooks
- Format with Prettier (recommended)

## Testing

Run tests before submitting PRs:
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add scenario comparison feature`
- `fix: resolve file upload validation issue`
- `docs: update API documentation`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass
4. Update documentation if needed
5. Submit a pull request with a clear description

