const router = require("express").Router();
const Transferencia = require("../models/Transferencia.model.js");
const Cuenta = require("../models/Cuenta.model.js");
const tokenValidation = require("../middlewares/auth.middlewares.js");

// Ruta POST para crear una nueva transferencia
router.post("/", tokenValidation, async (req, res, next) => {
    const { cantidad, cuentaOrigen, cuentaDestino, descripcion } = req.body;

    // Verificación de valores
    if (!cantidad || !cuentaOrigen || !cuentaDestino) {
        return res.status(400).json({ message: "Cantidad, cuenta de origen y cuenta de destino son requeridas." });
    }

    try {
        // Verifica que las cuentas pertenecen al usuario
        const cuentaOrigenData = await Cuenta.findOne({ _id: cuentaOrigen, user: req.payload._id });
        const cuentaDestinoData = await Cuenta.findOne({ _id: cuentaDestino, user: req.payload._id });

        if (!cuentaOrigenData || !cuentaDestinoData) {
            return res.status(404).json({ message: "Una o ambas cuentas no pertenecen al usuario." });
        }

        // Verifica que la cuenta de origen tiene suficiente dinero
        if (cuentaOrigenData.cantidad < cantidad) {
            return res.status(400).json({ message: "Dinero insuficiente en la cuenta de origen." });
        }

        // Realiza la transferencia
        const nuevaTransferencia = await Transferencia.create({
            cantidad,
            cuentaOrigen,
            cuentaDestino,
            descripcion,
            usuario: req.payload._id
        });

        // Actualiza el balance de las cuentas
        await Cuenta.findByIdAndUpdate(cuentaOrigen, { $inc: { cantidad: -cantidad } });
        await Cuenta.findByIdAndUpdate(cuentaDestino, { $inc: { cantidad: cantidad } });

        const transferenciaConDetalles = await Transferencia.findById(nuevaTransferencia._id).populate("cuentaOrigen").populate("cuentaDestino");
        res.status(201).json(transferenciaConDetalles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creando la transferencia." });
        next(error);
    }
});

// Ruta GET para obtener todas las transferencias del usuario
router.get("/user", tokenValidation, async (req, res, next) => {
    try {
        const transferencias = await Transferencia.find({ usuario: req.payload._id }).populate("cuentaOrigen").populate("cuentaDestino");
        res.status(200).json(transferencias);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error obteniendo las transferencias del usuario." });
        next(error);
    }
});

// Ruta GET para obtener las transferencias de una cuenta específica del usuario
router.get("/cuenta/:cuentaId", tokenValidation, async (req, res, next) => {
    const { cuentaId } = req.params;

    try {
        // Verificar que la cuenta pertenece al usuario
        const cuenta = await Cuenta.findOne({ _id: cuentaId, user: req.payload._id });
        if (!cuenta) {
            return res.status(404).json({ message: "Cuenta no encontrada o no pertenece al usuario." });
        }

        // Obtener las transferencias relacionadas con la cuenta
        const transferencias = await Transferencia.find({
            $or: [{ cuentaOrigen: cuentaId }, { cuentaDestino: cuentaId }]
        }).populate("cuentaOrigen").populate("cuentaDestino");
        res.status(200).json(transferencias);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error obteniendo las transferencias de la cuenta." });
        next(error);
    }
});

// Ruta PUT para actualizar una transferencia
router.put("/:transferenciaId", tokenValidation, async (req, res, next) => {
    const { transferenciaId } = req.params;
    const { cantidad, cuentaOrigen, cuentaDestino, descripcion } = req.body;

    try {
        // Encuentra la transferencia y actualízala
        const updatedTransferencia = await Transferencia.findOneAndUpdate(
            { _id: transferenciaId, usuario: req.payload._id },
            { cantidad, cuentaOrigen, cuentaDestino, descripcion },
            { new: true, runValidators: true }
        ).populate("cuentaOrigen").populate("cuentaDestino");

        // Si no se encuentra la transferencia, devolver un error 404
        if (!updatedTransferencia) {
            return res.status(404).json({ message: "Transferencia no encontrada o no pertenece al usuario." });
        }

        res.status(200).json(updatedTransferencia);
    } catch (error) {
        next(error);
    }
});

// Ruta DELETE para eliminar una transferencia
router.delete("/:transferenciaId", tokenValidation, async (req, res, next) => {
    const { transferenciaId } = req.params;

    try {
        // Encuentra y elimina la transferencia
        const transferenciaEliminada = await Transferencia.findOneAndDelete({
            _id: transferenciaId,
            usuario: req.payload._id
        });

        // Si no se encuentra la transferencia, devolver un error 404
        if (!transferenciaEliminada) {
            return res.status(404).json({ message: "Transferencia no encontrada o no pertenece al usuario." });
        }

        // Revertir el saldo en las cuentas afectadas
        await Cuenta.findByIdAndUpdate(transferenciaEliminada.cuentaOrigen, { $inc: { cantidad: transferenciaEliminada.cantidad } });
        await Cuenta.findByIdAndUpdate(transferenciaEliminada.cuentaDestino, { $inc: { cantidad: -transferenciaEliminada.cantidad } });

        res.status(200).json({ message: "Transferencia eliminada con éxito" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;