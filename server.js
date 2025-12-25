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
const SettingRouter = require('./Routes/SettingRoute');
const {  LoggedIn, checked, LoggedOut } = require('./Controller/LoginController');
const { checkAuth } = require('./middleware/Authmiddleware');

const app = express();
dotenv.config();
app.use(cors({
    origin: ["http://localhost:5173","https://leadership-hub-bn8s.vercel.app/"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(async()=>{
    console.log("Database Connected")
    
})


// Middleware

// Routes

// route for the user home 
app.use('/home',HomeRouter)

// route for the bio 
app.use('/bio',BioRouter)
 
// route for the events 
app.use('/event',EventRouter)

//route for the gallery
app.use('/gallery',GalleryRouter)

// route for the news 
app.use('/news',NewsRouter)

//route for the contact
app.use('/contact',ContactRouter)

// route for the bookstore 
app.use('/store',BookRouter)

// route for the setting 
app.use('/setting',SettingRouter)

app.post('/login',LoggedIn)
app.post('/logout',LoggedOut)
app.get('/check',checkAuth,checked)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});