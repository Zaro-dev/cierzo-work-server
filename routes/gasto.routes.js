const router = require("express").Router();
const Gasto = require("../models/Gasto.model.js");
const tokenValidation = require("../middlewares/auth.middlewares.js");

// Ruta POST para gastos
router.post("/", tokenValidation, async (req, res, next) => {
    const { cantidad, cuenta, description, categoria } = req.body;

    // Verificación de valores
    if (!cantidad || !cuenta) {
        return res.status(400).json({ message: "La cantidad y la cuenta son requeridas." });
    }

    try {
        // Crea el nuevo gasto
        const newGasto = await Gasto.create({
            cantidad,
            cuenta,
            description,
            categoria
        });

        // Manda el nuevo gasto creado
        res.status(201).json(newGasto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creando el gasto." });
        next(error);
    }
});

// Ruta GET para ver registro de gastos de un usuario
router.get("/user", tokenValidation, async (req, res, next) => {
    try {
        // Obtener todos los gastos del usuario, con populate para incluir la cuenta
        const gastosUser = await Gasto.find({ user: req.payload._id })
            .populate('cuenta'); // Aquí se usa populate para traer la información de la cuenta asociada

        res.status(200).json(gastosUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error obteniendo los gastos del usuario." });
        next(error);
    }
});

// Ruta GET para sacar los gastos de una cuenta específica del usuario
router.get("/cuentas/:cuentaId", tokenValidation, async (req, res, next) => {
    const { cuentaId } = req.params;

    try {
        // Obtener los gastos de la cuenta específica, con populate para incluir la cuenta
        const cuentaGastos = await Gasto.find({ cuenta: cuentaId })
            .populate('cuenta'); // Aquí se usa populate para traer la información de la cuenta asociada

        res.status(200).json(cuentaGastos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error obteniendo los gastos de la cuenta." });
        next(error);
    }
});

// PUT para actualizar un gasto
router.put("/:gastoId", tokenValidation, async (req, res, next) => {
    const { gastoId } = req.params;
    const { cantidad, description, categoria } = req.body;

    try {
        // Encuentra el gasto y actualízalo
        const updatedGasto = await Gasto.findOneAndUpdate(
            { _id: gastoId },
            { cantidad, description, categoria },
            { new: true, runValidators: true }
        );

        // Si no se encuentra el gasto, devolver un error 404
        if (!updatedGasto) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        // Mandar el gasto actualizado
        res.status(200).json(updatedGasto);
    } catch (error) {
        next(error);
    }
});

// DELETE para un gasto específico
router.delete("/:gastoId", tokenValidation, async (req, res, next) => {
    const { gastoId } = req.params;

    try {
        // Borrar por id
        const gastoBorrado = await Gasto.findOneAndDelete({ _id: gastoId });

        // Si no se encuentra el gasto, devolver un error 404
        if (!gastoBorrado) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        // Responder con un mensaje de éxito
        res.status(200).json({ message: "Gasto eliminado con éxito" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
