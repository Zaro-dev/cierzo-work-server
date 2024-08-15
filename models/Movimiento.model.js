const { Schema, model } = require("mongoose");

const movimientoSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, "La cantidad del movimiento es requerida"],
    },
    cuenta: {
        type: Schema.Types.ObjectId,
        ref: "Cuenta"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    description: String,
    categoria: String,
    tipo: {
        type: String,
        enum: ["gasto", "ingreso"]
    }
},

{
    timestamps: true
})

const Movimiento = model("Movimiento", movimientoSchema)

module.exports = Movimiento;