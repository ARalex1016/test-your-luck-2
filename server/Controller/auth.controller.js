import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import util from "util";

// Model
import User from "./../Model/User.model.js";

// Utils
import { validatePassword } from "../Utils/StringManager.js";
import { generateAndSetJwtToken } from "../Utils/generateAndSetJwtToken.js";
import { log } from "console";

export const signup = async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword, invitedBy } =
    req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required!",
    });
  }

  try {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists!",
      });
    }

    const phoneNumberExists = await User.findOne({ phoneNumber });

    if (phoneNumberExists) {
      return res.status(400).json({
        status: "fail",
        message: "Phone Number already exists!",
      });
    }

    const passwordValidity = validatePassword(password);

    if (!passwordValidity) {
      return res.status(400).json({
        status: "fail",
        message: "Your Password is not strong!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Password and confirm password doesn't match!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let inviter;
    if (invitedBy) {
      inviter = await User.findById(invitedBy);

      if (!inviter) {
        return res.status(404).json({
          status: "fail",
          message: "Invalid Inviter Id!",
        });
      }
    }

    const user = await User.create({ ...req.body, password: hashedPassword });

    if (inviter) {
      inviter.referrals.push(user._id);
      await inviter.save();
    }

    const token = generateAndSetJwtToken(user, res);

    // Success
    res.status(201).json({
      status: "success",
      message: "User created successful",
      data: { ...user._doc, password: undefined },
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required!",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User with this email doesn't exist!",
      });
    }

    let passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(400).json({
        status: "fail",
        message: "Password doesn't matched!",
      });
    }

    const token = generateAndSetJwtToken(user, res);

    // Success
    res.status(200).json({
      status: "success",
      message: "Logged in successful!",
      data: user,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
      expires: new Date(0), // Set expiration to a past date
    });

    res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging out",
      error: error.message,
    });
  }
};

export const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: No token provided",
    });
  }
  try {
    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY
    );

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user no longer exists!",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    // Error

    res.status(500).json({
      status: "fail",
      message: error.message || "Internal server error!",
    });
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};

export const authorize =
  (...role) =>
  (req, res, next) => {
    if (!role.includes(req.user.role)) {
      // Error
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action!",
      });
    }

    next();
  };
