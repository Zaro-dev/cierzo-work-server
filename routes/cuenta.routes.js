const router = require("express").Router();

const Cuenta = require("../models/Cuenta.model.js")

const tokenValidation = require("../middlewares/auth.middlewares.js")

// Ruta para crear una nueva cuenta
router.post('/', tokenValidation, async (req, res) => {
    const { name, cantidad } = req.body;
  
    // Verifica que los campos requeridos estén presentes
    if (!name || cantidad === undefined) {
      return res.status(400).json({ message: 'Nombre y cantidad son requeridos' });
    }
  
    try {
      // Se asocia la cuenta con el usuario autenticado
      const newCuenta = await Cuenta.create({
        name,
        cantidad,
        user: req.payload._id // Asocia la cuenta con el usuario autenticado usando el payload del token
      });
  
      res.status(201).json(newCuenta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la cuenta' });
    }
  });

// Ruta GET para obtener todas las cuentas de un usuario
router.get("/", tokenValidation, async (req, res, next) => {
    try {
        const userId = req.payload._id; // Obtenemos usuario desde el token

        // obtenemos cuentas desde el id
        const cuentas = await Cuenta.find({ user: userId });

        res.status(200).json(cuentas);
    } catch (error) {
        console.error("Error:", error); // Imprime detalles del error
        res.status(500).json({ message: "Error obteniendo las cuentas", error });
    }
});

// Ruta GET para obtener una cuenta específica del usuario
router.get("/:cuentaId", tokenValidation, async (req, res, next) => {
    const { cuentaId } = req.params;
  
    try {
      const cuenta = await Cuenta.findOne({ _id: cuentaId, user: req.payload._id });
      if (!cuenta) {
        return res.status(404).json({ message: "Cuenta no encontrada o no pertenece al usuario." });
      }
      res.status(200).json(cuenta);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error obteniendo la cuenta." });
      next(error);
    }
  });

// Ruta PUT para editar la cuenta de un usuario
router.put("/:cuentaId", tokenValidation, async (req, res, next) => {
    try {
        const { cuentaId } = req.params;
        const userId = req.payload._id; // Sacamos usuario desde el token
        const { name, cantidad } = req.body;

        // Verificamos usuario 
        const cuenta = await Cuenta.findOne({ _id: cuentaId, user: userId });

        if (!cuenta) {
            return res.status(404).json({ message: "Cuenta no encontrada o no pertenece al usuario" });
        }

        // Actualizamos los dataos
        const updatedCuenta = await Cuenta.findByIdAndUpdate(
            cuentaId,
            { name, cantidad },
            { new: true, runValidators: true } // Devuelve el documento actualizado
        );

        res.status(200).json({ message: "Cuenta actualizada con éxito", cuenta: updatedCuenta });
    } catch (error) {
        console.error("Error:", error); // Imprime detalles del error
        res.status(500).json({ message: "Error actualizando la cuenta", error });
    }
});

// Ruta DELETE para eliinar una cuenta
router.delete("/:cuentaId", async (req, res, next) => {
    const { cuentaId } = req.params;

    try {
        // Elimina la cuenta por el id
        const deletedCuenta = await Cuenta.findByIdAndDelete(cuentaId);

        if (!deletedCuenta) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }
        res.status(200).json({ message: "Cuenta eliminada con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error eliminando la cuenta" });
        next(error);
    }
});

module.exports = router;