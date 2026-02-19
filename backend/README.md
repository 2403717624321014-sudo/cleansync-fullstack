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

- Local server: `http://127.0.0.1:8000`.
- FastAPI Swagger UI docs:`http://127.0.0.1:8000/docs`.
- FastAPI ReDoc docs: `http://127.0.0.1:8000/redoc`.
  You can start editing the API by modifying `app/main.py`. The server auto-reloads as you edit the file.

This project uses FastAPI, Pydantic, and Uvicorn for clean, maintainable, and fast API development.

## Learn More
Relevant resources for this project:

- [FastAPI Documentation](https://fastapi.tiangolo.com/) – Core API framework docs
- [Pydantic Documentation](https://docs.pydantic.dev/latest/) – Data validation & models
- [Uvicorn Documentation](https://uvicorn.dev/) – ASGI server docs
- [FastAPI GitHub Repository](https://github.com/fastapi/fastapi) – Open-source repo
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) – Step-by-step beginner guide
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/) – Deployment best practices
- [FastAPI Docker Deployment](https://fastapi.tiangolo.com/deployment/docker/) – Docker guide

## Deploy on Production
The recommended ways to deploy a FastAPI backend:
- [Dockerize FastAPI](https://fastapi.tiangolo.com/deployment/docker/) – Guide to containerize your FastAPI app for production.
- [Production Deployment with Uvicorn & Gunicorn](https://fastapi.tiangolo.com/deployment/#using-gunicorn-with-uvicorn-workers) – Best practices for scalable deployment.
- [Deploy on Serverless / Cloud Platforms](https://vercel.com/docs/functions) – Serverless deployment options.
  

