const Login = require("../Models/AdminModel.js");
const bcrypt = require('bcrypt');

const updateAdmin = async (req, res) => {
    console.log(req.body)
    try {
        const { oldEmail, oldPassword, newPassword, newGmail } = req.body;

        // Validate input
        if (!oldEmail || !oldPassword) {
            return res.status(400).json({ message: "Email and old password are required" });
        }

        const admin = await Login.findOne({ email: oldEmail });
        if (!admin) return res.status(401).json({ message: "Incorrect Email" });

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Incorrect Password" });

        const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : admin.password;

        const updatedAdmin = await Login.findByIdAndUpdate(
            admin._id,
            { email: newGmail || oldEmail, password: hashedPassword },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "Admin updated successfully", data: updatedAdmin });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = updateAdmin;
