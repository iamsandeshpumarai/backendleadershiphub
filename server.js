const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const HomeRouter = require('./Routes/HomeRoute');
const mongoose = require('mongoose');
const BioRouter = require('./Routes/BiographyRoute');
const EventRouter = require('./Routes/EventRouter');
const GalleryRouter = require('./Routes/GalleryRoute');
const NewsRouter = require('./Routes/NewsRoute');
const ContactRouter = require('./Routes/ContactRoute');
const BookRouter = require('./Routes/BookStoreRoute');
const {  LoggedIn, checked, LoggedOut } = require('./Controller/LoginController');
const { checkAuth } = require('./middleware/Authmiddleware');
const app = express();
dotenv.config();
app.use(cors({
    origin: ["http://localhost:5173","https://leadership-hub.vercel.app"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(async()=>{
    console.log("Database Connected")
    
})


// Middleware

// Routes

// router for the user home 
app.use('/home',HomeRouter)

// router for the bio 
app.use('/bio',BioRouter)
 
// router for the events 
app.use('/event',EventRouter)

//router for the gallery
app.use('/gallery',GalleryRouter)

// router for the news 
app.use('/news',NewsRouter)

//router for the contact
app.use('/contact',ContactRouter)

// router for the bookstore 
app.use('/store',BookRouter)

app.post('/login',LoggedIn)
app.post('/logout',LoggedOut)
app.get('/check',checkAuth,checked)
app.get('/api/sampling', (req, res) => {
    res.json({ message: 'Sampling endpoint' });
});

app.post('/api/sampling', (req, res) => {
    res.json({ message: 'Sampling data received' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
