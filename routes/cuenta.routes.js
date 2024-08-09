const router = require("express").Router();

const Cuenta = require("../models/Cuenta.model.js")

router.post("/", async (req,res,next) => {
    console.log(req.body)
    try {
        const allAccounts = await Cuenta.create({
            name: req.body.name,
            user: req.body.user,
            cantidad: req.body.cantidad
        }, {new: true})
        res.status(201).json({message: "Cuenta creada con éxito"})
    } catch (error) {
        res.status(500).json({message: "Error obteniendo info"})
    }
})

module.exports = router;