# FinTrek Server Application

This directory contains the backend server application for the FinTrek personal finance management dashboard. The server is built using Flask, a lightweight web application framework for Python, along with various other libraries and tools for data processing, machine learning, and database management.

## Technologies Used

- **Flask**: A lightweight web application framework for Python
- **Supabase**: An open-source alternative to Firebase that provides a PostgreSQL database, authentication, and more
- **Pandas**: A fast, powerful, and easy-to-use data analysis and manipulation library for Python
- **scikit-learn**: A machine learning library for Python, featuring various classification, regression, and clustering algorithms
- **Docker**: A platform for developing, shipping, and running applications in containers
- **Gunicorn**: A Python WSGI HTTP server for UNIX

## Getting Started

To set up the server application locally, follow these steps:

1. Make sure you have Python (v3.8 or above) and Docker installed on your machine.

2. Clone the FinTrek repository and navigate to the `Server` directory:

   ```bash
   git clone https://github.com/dangphung4/fintrek.git
   cd fintrek/Server
   ```

3. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

4. Install the project dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Set up the Supabase database:
   - Create a new project on the Supabase dashboard
   - Obtain the Supabase project URL and API key
   - Update the Supabase connection details in `config.py`

6. Start the development server:

   ```bash
   flask run
   ```

7. The server should now be running at `http://localhost:5000`.

## Project Structure

The `Server` directory has the following structure:

```bash
Server/
├── app/
│   ├── models/
│   │   └── ...
│   ├── routes/
│   │   └── ...
│   ├── services/
│   │   └── ...
│   ├── ml/
│   │   └── ...
│   ├── __init__.py
│   └── ...
├── tests/
│   └── ...
├── config.py
├── Dockerfile
├── requirements.txt
└── README.md
```

- `app/`: Contains the main application code
  - `models/`: Database models and schemas
  - `routes/`: API routes and request handlers
  - `services/`: Business logic and data manipulation services
  - `ml/`: Machine learning models and utilities
- `tests/`: Contains unit tests for the application
- `config.py`: Configuration settings for the application
- `Dockerfile`: Instructions for building a Docker image of the application
- `requirements.txt`: Lists the Python dependencies for the project
- `README.md`: This README file

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file in the root directory for guidelines on how to contribute to this project.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Supabase Documentation](https://supabase.io/docs)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [scikit-learn Documentation](https://scikit-learn.org/stable/documentation.html)
- [Docker Documentation](https://docs.docker.com/)
- [Gunicorn Documentation](https://docs.gunicorn.org/en/stable/)

If you have any questions or need assistance, please don't hesitate to reach out to the team or consult the [Getting Help](../HELP-ME.md) guide.
