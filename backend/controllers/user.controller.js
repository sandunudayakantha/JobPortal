import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
//Google OAuth/OpenID Connect Implementation
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password } = req.body;

        // Do not trust `role` from the client. Assign server-side below.
        if (!fullname || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        let profilePhoto = "";
        if (req.file) {
            // Validate buffer-based file type before sending to Cloudinary
            try {
                const { detectFileType } = await import('../middlewares/mutler.js');
                const detected = detectFileType(req.file.buffer);
                if (!['jpeg','png','gif','webp'].includes(detected)) {
                    return res.status(400).json({ message: 'Invalid file type for profile photo. Only images are allowed.', success: false });
                }
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhoto = cloudResponse.secure_url;
            } catch (uploadError) {
                console.warn("Cloudinary upload skipped/failed:", uploadError.message);
                return res.status(400).json({ message: 'Invalid file upload.', success: false });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Force public registrations to be regular students to prevent
        // client-controlled privilege escalation (do NOT trust req.body.role)
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role: 'student', // assigned server-side
            profile: {
                profilePhoto,
            }
        });

        // Create a sanitized user object for the response
        const userResponse = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            profile: newUser.profile
        };

        // Generate token for automatic login
        const tokenData = {
            userId: newUser._id
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(201)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true, // Fix for Authentication Cookie Is Readable by JavaScript
                sameSite: 'none',
                secure: process.env.NODE_ENV === "production"
            })
            .json({
                message: "Account created successfully.",
                user: userResponse,
                success: true
            });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password",
                success: false
            });
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true, // Fix for V1: Authentication Cookie Is Readable by JavaScript
                sameSite: 'none',
                secure: process.env.NODE_ENV === "production"
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}




export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        let cloudResponse;

        if (file) {
            // Validate buffer-based file type before processing as resume
            try {
                const { detectFileType } = await import('../middlewares/mutler.js');
                const detected = detectFileType(file.buffer);
                // accept pdf, doc, docx for resumes
                if (!['pdf','doc','docx'].includes(detected)) {
                    return res.status(400).json({ message: 'Invalid file type for resume. Only PDF or Word documents are allowed.', success: false });
                }
            } catch (e) {
                console.error('File validation error:', e);
                return res.status(400).json({ message: 'Invalid file upload.', success: false });
            }

            const fileUri = getDataUri(file); // Convert the file to Data URI
            cloudResponse = await cloudinary.uploader.upload(fileUri.content); // Upload to Cloudinary
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // Get user ID from the authenticated request
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update the user fields if new data is provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // If a new resume file is uploaded, update the resume URL and name
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save the original file name
        }

        // Save the updated user document
        await user.save();

        // Prepare the updated user data to be sent in the response
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false
        });
    }
};

//Google OAuth/OpenID Connect Implementation
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const fullname = payload.name;
        const profilePhoto = payload.picture;

        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user for Google login
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            user = await User.create({
                fullname,
                email,
                phoneNumber: 0,
                password: randomPassword,
                role: 'student',
                profile: {
                    profilePhoto
                }
            });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === "production"
            })
            .json({
                message: `Welcome back ${userResponse.fullname}`,
                user: userResponse,
                success: true
            });

    } catch (error) {
        console.error('Google login error:', error);
        return res.status(500).json({
            message: "Internal server error during Google login",
            success: false
        });
    }
};
