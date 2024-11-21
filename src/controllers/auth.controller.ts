import { Request, Response } from "express";
import { User, UserDocument } from "../models/user.model";

const bcrypt = require("bcrypt");

export const register = async function (req: Request, res: Response) {
  let user: unknown;
  try {
    user = await User.create({
      ...req.body,
      hash_password: bcrypt.hashSync(req.body.password, 10),
    });
  } catch (err: any) {
    return res.status(400).json({
      message: "User exists",
      errors: [err.message],
      data: {},
    });
  }

  let _user = user as UserDocument;
  return res.json(_user.login("Signed up successfully"));
};

export const login = async function (req: Request, res: Response) {
  let user = (await User.findOne({
    email: req.body.email,
  })) as UserDocument;
  if (!user || !user.comparePassword(req.body.password)) {
    return res.status(401).json({
      message: "Authentication failed. Invalid user or password.",
    });
  }
  return res.json(user.login("Logged in successfully"));
};
export const profile = async function (req: Request, res: Response) {
  let user = (await User.findOne({
    email: req.user.email,
  })) as UserDocument;
  return res.status(200).json(user.login("Profile fetched successfully!!"));
};
