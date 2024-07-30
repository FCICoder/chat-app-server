import bcrypt , { compare  }  from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are Required." });
    }
    // Check for existing user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists." });
    }
    // Create a new user
    const newUser = await User.create({ email, password });
    res.cookie("jwt", createToken(email, newUser._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({
      newUser: {
        id: newUser._id,
        email: newUser.email,
        profileSetup: newUser.profileSetup,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are Required." });
    }
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Please Signup First." });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ msg: "Password Incorrect" });
    }
    // Generate JWT token
    res.cookie("jwt", createToken(user.email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) return res.status(404).send("User Not Found");

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    console.log(firstName, lastName, color);
    if (!firstName || !lastName || color == undefined) {
      return res
        .status(400)
        .send("First name or last name or color is required");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("file is required");

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("user not found");

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).json({
      msg: "Profile Image Deleted successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};


export const logout = async (req, res) => {
  try {
    res.cookie("jwt","" , {maxAge:1 , secure:true , sameSite:"None"})
    


    return res.status(200).json({
      msg: "Logout successfully.",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};