# FinTrek Web Application

This directory contains the frontend web application for the FinTrek personal finance management dashboard. The application is built using React, Vite, Chakra UI, and various other modern web technologies.

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **Vite**: A fast build tool and development server for modern web applications
- **Chakra UI**: A simple, modular, and accessible component library for React
- **Chart.js**: A JavaScript charting library for creating interactive and responsive charts
- **D3.js**: A powerful data visualization library for manipulating documents based on data
- **Axios**: A promise-based HTTP client for making API requests
- **React Router**: A collection of navigational components for declarative routing in React
- **Framer Motion**: A production-ready motion library for React
- **Node.js**: A JavaScript runtime for executing server-side code

## Getting Started

To set up the web application locally, follow these steps:

1. Make sure you have Node.js (v14 or above) installed on your machine.

2. Clone the FinTrek repository and navigate to the `Web` directory:

   ```bash
   git clone https://github.com/dangphung4/fintrek.git
   cd fintrek/Web
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the application running.

## Project Structure

The `Web` directory has the following structure:

```bash
Web/
├── public/
│   └── ...
├── src/
│   ├── components/
│   │   └── ...
│   ├── pages/
│   │   └── ...
│   ├── services/
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

- `public/`: Contains public assets like images, fonts, etc.
- `src/`: Contains the main source code of the application
  - `components/`: Reusable UI components used throughout the application
  - `pages/`: Top-level page components that represent different routes
  - `services/`: Services for making API requests and handling data
  - `utils/`: Utility functions and helpers
  - `App.jsx`: The main application component
  - `index.css`: Global styles for the application
  - `main.jsx`: The entry point of the application
- `.env`: Environment variables for the application
- `.gitignore`: Specifies files and directories to be ignored by Git
- `index.html`: The main HTML template for the application
- `package.json`: NPM package configuration and dependencies
- `README.md`: This README file
- `vite.config.js`: Vite configuration file

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file in the root directory for guidelines on how to contribute to this project.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [React Documentation](https://reactjs.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [D3.js Documentation](https://d3js.org/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Router Documentation](https://reactrouter.com/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

If you have any questions or need assistance, please don't hesitate to reach out to the team or consult the [Getting Help](../HELP-ME.md) guide.
