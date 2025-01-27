import bcrypt from "bcryptjs";
import colors from "colors";
import cors from "cors";
import createError from "http-errors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import Joi from "joi";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import morgan from "morgan";
import nodemailer from "nodemailer";
import path, { dirname } from "path";
import winston from "winston";

export {
  bcrypt,
  colors,
  cors,
  createError,
  dotenv,
  dirname,
  express,
  fs,
  fileURLToPath,
  Joi,
  jwt,
  mongoose,
  morgan,
  nodemailer,
  path,
  winston,
};
