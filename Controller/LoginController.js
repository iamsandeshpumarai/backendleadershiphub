const Login = require("../Models/AdminModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createLogin = async(req,res) =>{
const {email,password} = req.body
    try{
        if(!email || !password) return res.status(200).json({message:"Fill credential"})
        const HashedPass = await bcrypt.hash(password,10)
 await Login.create({email,password:HashedPass})
res.status(200).json({message:"data saved"})
}
    catch(err){
        console.log(err.message)
    }
}

const LoggedIn = async (req, res) => {
    const { email, password } = req.body;
console.log(req.body)
console.log(" aim on login route")
    try {
        if (!email || !password) 
            return res.status(400).json({ message: "Enter Email and Password" });

        // Find the only admin user
        const admin = await Login.findOne(); // no filter needed, just one record
        if (!admin) 
            return res.status(400).json({ message: "Admin not found" });

        // Check if email matches
        if (email !== admin.email) 
            return res.status(400).json({ message: "Incorrect Email" });

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) 
            return res.status(400).json({ message: "Invalid Password" });

        // Generate JWT
        const token = jwt.sign({ id: admin._id }, "iloveyoumyan", { expiresIn: "1h" });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 ,
            sameSite:"none",
            secure:true

        });

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const checked = (req, res) => {
    console.log("iam on checked")
    console.log("iamonchecked route")
    try {
        const id = req.id;
        res.status(200).json({ message: "Found Credential", data: id || "this is the data"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const LoggedOut = (req,res)=>{
    try{
res.clearCookie("token");
res.status(200).json({message:"Logout Successfully"})
     
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = {createLogin,LoggedIn,checked,LoggedOut}