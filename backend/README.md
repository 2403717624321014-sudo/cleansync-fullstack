# CleanSync Backend

This is a [FastAPI](https://fastapi.tiangolo.com/) backend for the CleanSync project, handling API requests and serving data to the frontend.

## Getting Started

First, install dependencies and run the development server:

```bash
# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload
```
Open the following links in your browser:

- Local server: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- FastAPI Swagger UI docs:[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- FastAPI ReDoc docs: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
  You can start editing the API by modifying `app/main.py. The server auto-reloads as you edit the file.

This project uses FastAPI, Pydantic, and Uvicorn for clean, maintainable, and fast API development.

