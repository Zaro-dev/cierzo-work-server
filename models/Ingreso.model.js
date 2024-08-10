const { Schema, model } = require("mongoose");

const ingresoSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, "La cantidad de ingreso es requerida"],
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
    categoria: String
},

{
    timestamps: true
})

const Ingreso = model("Ingreso", ingresoSchema)

module.exports = Ingreso;