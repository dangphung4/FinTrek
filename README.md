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
- Plaid integration for bank account connectivity
- Dark/Light mode support

## Technologies Used

- **Backend**: Node.js with Express
- **Frontend**: React with Vite
- **UI Libraries**: Chakra UI, Material-UI
- **Data Visualization**: Recharts, D3.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Banking Integration**: Plaid API
- **Deployment**: Docker, AWS/Vercel

## Prerequisites

Before running the application, make sure you have:

- Node.js (v14+)
- npm or yarn
- Git
- A Supabase account and project
- A Plaid developer account
- Docker (optional, for containerized deployment)

## Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/dangphung4/fintrek.git
   cd fintrek
   ```

2. Set up environment variables:

   For the Server (.env):

   ```
   PORT=8080
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

   For the Web (.env):

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:8080
   ```

## Installation & Running Locally

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd Server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run devStart
   ```

The server will run on <http://localhost:8080>

### Frontend Setup

1. Navigate to the web directory:

   ```bash
   cd Web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The application will be available at <http://localhost:3000>

## Docker Deployment

1. Build the Docker images:

   ```bash
   # Build server
   cd Server
   docker build -t fintrek-server .

   # Build web app
   cd ../Web
   docker build -t fintrek-web .
   ```

2. Run the containers:

   ```bash
   docker run -p 8080:8080 fintrek-server
   docker run -p 3000:3000 fintrek-web
   ```

## Using the Application

1. Create an account or log in
2. Connect your bank accounts using Plaid
3. Set up your budget categories and limits
4. Track expenses and view financial insights
5. Analyze spending patterns through interactive charts
6. Receive personalized financial recommendations

## Development Guidelines

- Follow the coding conventions in CODINGCONVENTIONS.md
- Use the provided issue templates for bug reports and feature requests
- Submit pull requests following the guidelines in CONTRIBUTING.md
- Test your changes thoroughly before submitting

## Troubleshooting

If you encounter issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check Supabase and Plaid dashboard for API errors
5. Consult the [Getting Help](HELP-ME.md) guide

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Team

- Alejandro Manrique-Pinell
- Dang Phung (Project Lead)
- Rusul Abbas
- Shams Abbas

```
     ____________________________________________________
    |.==================================================,|
    ||  I WILL MERGE AND REVIEW PULL REQUESTS QUICKLY   ||
    ||  I WILL MERGE AND REVIEW PULL REQUESTS QUICKLY   ||
    ||  I WILL MERGE AND REVIEW PULL REQUESTS QUICKLY   ||
    ||  I .----.ERG,                                    ||
    ||   / ><   \  /                                    ||
    ||  |        |/\                                    ||
    ||   \______//\/                                    ||
    ||   _(____)/ /                                     ||
    ||__/ ,_ _  _/______________________________________||
    '===\___\_) |========================================'
         |______|
         |  ||  |
         |__||__|
         (__)(__)
```

---
