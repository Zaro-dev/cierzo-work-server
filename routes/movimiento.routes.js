const router = require("express").Router();
const Movimiento = require("../models/Movimiento.model.js");
const tokenValidation = require("../middlewares/auth.middlewares.js");

// Ruta GET para obtener los movimientos asociados a una cuenta específica del usuario
router.get('/cuenta/:cuentaId', tokenValidation, async (req, res) => {
    try {
        const movimientos = await Movimiento.find({ 
            cuenta: req.params.cuentaId, 
            user: req.payload._id 
        });
        
        if (!movimientos) {
            return res.status(404).json({ message: "No se encontraron movimientos para esta cuenta." });
        }

        res.status(200).json(movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo los movimientos" });
    }
});

// Ruta GET para obtener un movimiento específico
router.get('/:movimientoId', tokenValidation, async (req, res) => {
    try {
        const movimiento = await Movimiento.findOne({ 
            _id: req.params.movimientoId, 
            user: req.payload._id 
        });

        if (!movimiento) {
            return res.status(404).json({ message: "Movimiento no encontrado o no pertenece al usuario." });
        }

        res.status(200).json(movimiento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo el movimiento" });
    }
});

// Ruta POST para crear un nuevo movimiento
router.post('/', tokenValidation, async (req, res) => {
    const { cantidad, cuenta, description, categoria, tipo } = req.body;

    if (!cantidad || !cuenta || !tipo) {
        return res.status(400).json({ message: 'Cantidad, cuenta y tipo son requeridos' });
    }

    try {

        const newMovimiento = await Movimiento.create({
            cantidad,
            cuenta,
            user: req.payload._id, 
            description,
            categoria,
            tipo
        });

        res.status(201).json(newMovimiento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el movimiento' });
    }
});

router.put('/:movimientoId', tokenValidation, async (req, res) => {
    const { cantidad, description, categoria, tipo } = req.body;

    try {
       
        const movimiento = await Movimiento.findOne({ 
            _id: req.params.movimientoId, 
            user: req.payload._id 
        });

        if (!movimiento) {
            return res.status(404).json({ message: "Movimiento no encontrado o no pertenece al usuario." });
        }

        
        const updatedMovimiento = await Movimiento.findByIdAndUpdate(
            req.params.movimientoId,
            { cantidad, description, categoria, tipo },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedMovimiento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error actualizando el movimiento" });
    }
});

// Ruta DELETE para eliminar un movimiento específico
router.delete('/:movimientoId', tokenValidation, async (req, res) => {
    try {
        
        const movimiento = await Movimiento.findOneAndDelete({ 
            _id: req.params.movimientoId, 
            user: req.payload._id 
        });

        if (!movimiento) {
            return res.status(404).json({ message: "Movimiento no encontrado o no pertenece al usuario." });
        }

        res.status(200).json({ message: "Movimiento eliminado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error eliminando el movimiento" });
    }
});

module.exports = router;