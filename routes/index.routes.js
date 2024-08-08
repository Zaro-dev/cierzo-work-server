const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

const serviceRouter = require("./service.routes.js")
router.use("/services", serviceRouter)



module.exports = router;
