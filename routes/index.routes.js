const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

const cuentaRouter = require("./cuenta.routes.js")
router.use("/cuentas", cuentaRouter)

const ingresoRouter = require("./ingreso.routes.js")
router.use("/ingresos", ingresoRouter)

const gastoRouter = require("./gasto.routes.js")
router.use("/gastos", gastoRouter)

const movimientoRouter = require("./movimiento.routes.js")
router.use("/movimientos", movimientoRouter)

module.exports = router;
