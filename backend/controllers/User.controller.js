import RedisCLI from '../services/Redis.js';
import { validationResult } from "express-validator";
import {UserModel} from '../models/User.model.js'
import {Compare,Hash} from '../services/Bcrypt.js'
import {Sign,Verify} from '../services/jwt.js'

export const CreateUserController = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { name, email, password } = req.body;

    const PresentUser = await UserModel.findOne({ email });

    if (PresentUser) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const HashedPass = await Hash(password);

    const User = await UserModel.create({ name, email, password: HashedPass });

    if (!User) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const Payload = {
      email,
      id: User._id,
    };

    const Token = await Sign(Payload);

    res.cookie("token", Token);

    return res.status(201).json({
      User,
      Token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const LoginUserController = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { email, password } = req.body;
    const User = await UserModel.findOne({ email }).select('+password');

    if (!User) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }


    const IsPassMatch = await Compare(password, User.password);

    if (!IsPassMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const Payload = {
      email,
      id: User._id,
    };

    const Token = await Sign(Payload);

    res.cookie("token", Token);

    return res.status(200).json({
      User,
      Token,
      success: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
}

export const ProfileController = async (req,res) => {
  try {
    const User = req.User
    if (!User) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      })
    }
    res.status(200).json({
      User,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    })
  }
};

export const LogoutController = async (req,res) => {
  try {
    const Token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if (!Token) {
        res.status(400).json({
            message:'UnAuthorized',
            success:false
        })
    }

    RedisCLI.set(Token,'logout','EX',60 * 60 * 24)

    res.cookie('token','')
    return res.status(200).json({
      message:"Logout Successfull",
      success:true
    })
    
  } catch (err) {
    res.status(500).json({
      message:"Something Went Wrong",
      success:false
    })
  }
}