const { Schema, model } = require("mongoose");

const transferenciaSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, "La cantidad de transferencia es requerida"],
    },
    cuentaOrigen: {
        type: Schema.Types.ObjectId,
        ref: "Cuenta",
        required: [true, "La cuenta de origen es requerida"]
    },
    cuentaDestino: {
        type: Schema.Types.ObjectId,
        ref: "Cuenta",
        required: [true, "La cuenta de destino es requerida"]
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El usuario es requerido"]
    }
},
{
    timestamps: true
});

const Transferencia = model("Transferencia", transferenciaSchema);

module.exports = Transferencia;