const {Schema, model} = require("mongoose");

const projectSchema = new Schema(
    {
        service: {
            type: Schema.Types.ObjectId, ref: "Service"
        },
        name: {
            type: String,
            required: true
        },
        description: String
    },
    {
        timestamps: true
    }
)

const Project = model("Project", projectSchema);

module.exports = Project;