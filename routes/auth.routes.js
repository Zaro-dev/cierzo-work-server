const transporter = require("../config/mailer.js")

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const User = require("../models/User.model.js")

const router = require("express").Router();
const tokenValidation = require("../middlewares/auth.middlewares.js")

router.post("/signup", async (req,res,next) => {
    const {name,email,password} = req.body;

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
            name,
            email,
            password: saltedPassword
        })

        await transporter.sendMail({
          from: '"Bienvenido 👻" <mariolazaroredolar@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Bienvenido ✔", // Subject line
          text: "Bienvenido a Cierzo Finances, gracias por confiar en nosotros para llevar el control de tus gastos.", // plain text body
          html: "<b>Hello world?</b>", // html body
        });
        
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.post("/login", async (req,res,next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).json({ errorMessage: "Email y contraseña son obligatorios" });
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
          name: foundUser.name
        };
    
        const authToken = jwt.sign(payload, process.env.SECRET_TOKEN, {
          algorithm: "HS256",
          expiresIn: "1d",
        });
    
        res.status(200).json({ authToken });
      } catch (error) {
        next(error);
      }
});

router.get("/verify", tokenValidation, (req,res,next) => {
  console.log(req.payload)

  res.status(200).json(req.payload)
})


module.exports = router;