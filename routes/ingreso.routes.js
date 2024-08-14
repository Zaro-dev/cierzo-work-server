const router = require("express").Router();
const Ingreso = require("../models/Ingreso.model.js");
const tokenValidation = require("../middlewares/auth.middlewares.js");

// Ruta POST para ingresos
router.post("/", tokenValidation, async (req, res, next) => {
    const { cantidad, cuenta, description, categoria } = req.body;

    // Verificación de valores
    if (!cantidad || !cuenta) {
        return res.status(400).json({ message: "La cantidad y la cuenta son requeridas." });
    }

    try {
        // Crea el nuevo ingreso
        const newIngreso = await Ingreso.create({
            cantidad,
            cuenta,
            description,
            categoria
        });

        // Manda el nuevo ingreso creado
        res.status(201).json(newIngreso);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creando el ingreso." });
        next(error);
    }
});

// Ruta GET para ver registro de ingresos de un usuario
router.get("/user", tokenValidation, async (req, res, next) => {
    try {
        // Obtener todos los ingresos del usuario, con populate para incluir la cuenta
        const ingresosUser = await Ingreso.find({ user: req.payload._id })
            .populate('cuenta'); // Aquí se usa populate para traer la información de la cuenta asociada

        res.status(200).json(ingresosUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error obteniendo los ingresos del usuario." });
        next(error);
    }
});

// Ruta GET para sacar los ingresos de una cuenta específica del usuario
router.get("/cuentas/:cuentaId", tokenValidation, async (req, res, next) => {
    const { cuentaId } = req.params;

    try {
        // Obtener los ingresos de la cuenta específica, con populate para incluir la cuenta
        const cuentaIngresos = await Ingreso.find({ cuenta: cuentaId })
            .populate('cuenta'); // Aquí se usa populate para traer la información de la cuenta asociada

        res.status(200).json(cuentaIngresos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error obteniendo los ingresos de la cuenta." });
        next(error);
    }
});

// PUT para actualizar un ingreso
router.put("/:ingresoId", tokenValidation, async (req, res, next) => {
    const { ingresoId } = req.params;
    const { cantidad, description, categoria } = req.body;

    try {
        // Encuentra el ingreso y actualízalo
        const updatedIngreso = await Ingreso.findOneAndUpdate(
            { _id: ingresoId },
            { cantidad, description, categoria },
            { new: true, runValidators: true }
        );

        // Si no se encuentra el ingreso, devolver un error 404
        if (!updatedIngreso) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }

        // Mandar el ingreso actualizado
        res.status(200).json(updatedIngreso);
    } catch (error) {
        next(error);
    }
});

// DELETE para un ingreso específico
router.delete("/:ingresoId", tokenValidation, async (req, res, next) => {
    const { ingresoId } = req.params;

    try {
        // Borrar por id
        const ingresoBorrado = await Ingreso.findOneAndDelete({ _id: ingresoId });

        // Si no se encuentra el ingreso, devolver un error 404
        if (!ingresoBorrado) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }

        // Responder con un mensaje de éxito
        res.status(200).json({ message: "Ingreso eliminado con éxito" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;