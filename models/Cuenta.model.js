const {Schema, model} = require("mongoose");


const cuentaSchema = new Schema({
    name: {
        type: String,
        required: [true, "Es necesario un nombre de cuenta"],
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cantidad: {
        type: Number,
        required: [true, "Es necesaria una cantidad inicial, si es 0 indíquelo"]
    }
},

{
    timestamps: true
}
)

const Cuenta = model("Cuenta", cuentaSchema)

module.exports = Cuenta;