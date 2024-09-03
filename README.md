# FinTrek: Personal Finance Management Dashboard

## Project Overview

FinTrek is an innovative personal finance dashboard designed to help users track their spending, create budgets, and plan their financial goals. Leveraging machine learning, FinTrek analyzes spending patterns to provide personalized financial advice, empowering users to make informed decisions about their money.

## Features

- Expense tracking and categorization
- Budget creation and management
- Financial goal setting and tracking
- Machine learning-powered spending analysis
- Personalized financial advice and recommendations
- Interactive charts and graphs for financial visualization

## Technologies Used

- **Backend**: Python with Flask
- **Frontend**: React.js
- **Data Processing**: Pandas
- **AI/ML**: scikit-learn
- **Database**: PostgreSQL (SUPABASE)
- **Visualization**: D3.js / Chart.js
- **Deployment**: Docker, AWS/Vercel

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- Docker
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dangphung4/fintrek.git
   cd fintrek
   ```

2. Set up the backend:
   ```
   cd Server
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd Web
   npm install
   ```

4. Set up the database:
   - Create a new PostgreSQL database
   - Update the database connection details in `Server/config.py`

5. Run the application:
   ```
   # In the Server directory
   flask run

   # In the Web directory
   npm start
   ```

## Project Structure

```
fintrek/
├── Server/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ml/
│   ├── tests/
│   ├── config.py
│   └── requirements.txt
├── Web/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── docs/
└── README.md
```

## Contributing

TODO: Figure out tasks and deadlines

## Development Phases

### Phase 1: Planning & Requirements (Week 1)
- Define core features and user stories
- Design database schema and API endpoints
- Create UI/UX wireframes

### Phase 2: Development (Weeks 2-3)
- Implement backend APIs and database integration
- Develop frontend dashboard components
- Create ML models for spending analysis and recommendations

### Phase 3: Testing & Deployment (Week 4)
- Conduct thorough testing, including security testing for financial data
- Deploy the application and set up monitoring
- Prepare user documentation and guides

## Learning Outcomes

Through this project, you'll gain experience in:
- Financial data analysis and visualization
- AI-driven personalized recommendations
- Full-stack web development with a focus on user experience (UX)
- Security practices for handling sensitive financial data

## License

TODO: Licensing?

## Acknowledgements

- Alejandro Manrique-Pinell
- Dang Phung
- Rusul Abbas
- Shams Abbas

---
