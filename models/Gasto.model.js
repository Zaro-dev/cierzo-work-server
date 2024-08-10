const { Schema, model } = require("mongoose");

const gastoSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, "La cantidad de gasto es requerida"],
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

const Gasto = model("Gasto", gastoSchema)

module.exports = Gasto;