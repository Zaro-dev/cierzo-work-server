const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const User = require("../models/User.model.js")

const router = require("express").Router();
const tokenValidation = require("../middlewares/auth.middlewares.js")

router.post("/signup", async (req,res,next) => {
    const {fullName,username,email,password,isFreelancer} = req.body;

    if(!email || !password) {
        res.status(400).json({errorMessage: "Email y password son obligatorios"});
        return;
    }
    try {
        const foundUser = await User.findOne({email: email});
        
        if(foundUser !== null){
            res.status(400).json({errorMessage: "El usuario ya se encuentra registrado"});
            return;
        }

        const salt = await bcrypt.genSalt(12);
        const saltedPassword = await bcrypt.hash(password, salt);

        await User.create({
            fullName,
            username,
            email,
            password: saltedPassword,
            isFreelancer
        })
        
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.post("/login", async (req,res,next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).json({ errorMessage: "Nombre de usuario y contraseña son obligatorios" });
        return;
      }
    
      try {
        const foundUser = await User.findOne({ email: email });
        console.log(foundUser);
        if (foundUser === null) {
          res
            .status(400)
            .json({
              errorMessage: "Usuario no registrado con ese nombre de usuario",
            });
          return;
        }
    
        const isPasswordCorrect = await bcrypt.compare(
          password,
          foundUser.password
        );
        if (isPasswordCorrect === false) {
          res.status(400).json({ errorMessage: "Contraseña no correcta" });
          return;
        }

        const payload = {
          _id: foundUser._id,
          email: foundUser.email,
          fullName: foundUser.fullName,
          username: foundUser.username,
          isFreelancer: foundUser.isFreelancer
        };
    
        const authToken = jwt.sign(payload, process.env.SECRET_TOKEN, {
          algorithm: "HS256",
          expiresIn: "7d",
        });
    
        res.status(200).json({ authToken });
      } catch (error) {
        next(error);
      }
})


module.exports = router;