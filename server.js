require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const HomeRouter = require('./Routes/HomeRoute');
const mongoose = require('mongoose');
const BioRouter = require('./Routes/BiographyRoute');
const EventRouter = require('./Routes/EventRouter');
const GalleryRouter = require('./Routes/GalleryRoute');
const NewsRouter = require('./Routes/NewsRoute');
const ContactRouter = require('./Routes/ContactRoute');
const InquryRouter = require('./Routes/InquryRoute');
const BookRouter = require('./Routes/BookStoreRoute');
const SettingRouter = require('./Routes/SettingRoute');
const {  LoggedIn, checked, LoggedOut } = require('./Controller/LoginController');
const { checkAuth } = require('./middleware/Authmiddleware');
const multer = require('multer');
const GalleryModel = require('./Models/GalleryModel');


const app = express();
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


// route for the messageinquiry
app.use('/inquiry',InquryRouter)
app.get('/api/location/:city',async(req,res)=>{
    const {city} = req.params

    try{

        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        const dataRes = await response.json();
        return res.status(200).json({message:"Fetched",data:dataRes})
    }
    catch(err){
        res.status(500).json({message:"Error fetching location",error:err.message})
    }
})
app.post('/login',LoggedIn)
app.post('/logout',LoggedOut)
app.get('/check',checkAuth,checked)

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error("Other Error:", err);
  res.status(500).json({ success: false, message: err.message });
});

app.delete("/clear-data",async(req,res)=>{ 
    try{
await GalleryModel.deleteMany({})
res.status(200).json({message:"All gallery data cleared"})
    }
    catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
 })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
