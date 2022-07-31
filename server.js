// Library imports
const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');

// Routes
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require("./routes/posts")


// App configs
dotenv.config()
const app = express();
const PORT = 3000;
const url = "mongodb+srv://khikhimedia:samosaman9@khikicluster0.fud56.mongodb.net/?retryWrites=true&w=majority";

// DB Connection
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log('Connected to mongodb'))
    .catch((err) => console.log(err))


// middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// Server Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

// Starting server on designated port
app.listen(PORT, () => { console.log(`Server Started on PORT: ${PORT}`) })
