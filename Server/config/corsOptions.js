
const whitelist = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:8080','http://localhost:5173'];

const corsOptions = {
    origin: (origin,callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('Invalid CORS origin request'))
        }
    },
    optionsSuccessStatus: 200,
    credentials: true, // Enable credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly list allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly list allowed headers
    maxAge: 86400 // Cache preflight requests for 24 hours
};

module.exports = corsOptions;