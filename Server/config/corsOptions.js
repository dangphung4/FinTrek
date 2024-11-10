const whitelist = [
    'http://localhost:8080',
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin,callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('Invalid CORS origin request'))
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;