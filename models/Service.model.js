const {Schema, model} = require("mongoose");

const serviceSchema = new Schema(
    {
        name:{
            type: String,
            required: [true, "Name is required."]
        },
        description: {
            type: String,
            required: [true, "Description is required."]
        },
        category:{
            type: String,
            required: [true, "Category is required."]
        },
        user: {
            type: Schema.Types.ObjectId, 
            ref: "User"
        }
    
    }
);

const Service = model("Service", serviceSchema);
module.exports = Service;

