const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const User = require("../models/User.model.js")

const router = require("express").Router();
const tokenValidation = require("../middlewares/auth.middlewares.js")