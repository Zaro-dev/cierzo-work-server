const {Schema, model} = require("mongoose")

const transferenciaSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, "La cantidad de transferencia es requerida"],
    },
    cuenta: {
        type: Schema.Types.ObjectId,
        ref: "Cuenta"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    description: String

},

{
    timestamps: true
}
)

const Transferencia = model("Transferencia", transferenciaSchema)

module.exports = Transferencia;