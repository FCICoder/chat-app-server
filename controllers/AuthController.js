import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

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
