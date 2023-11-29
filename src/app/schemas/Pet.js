import mongoose from "../../database/index.js";

const PetSchema = new mongoose.Schema({
    petName: {
        type: String,
        required: false,
    },
    petOwner: {
        type: String,
        required: true,
    },
    petImage: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Pet", PetSchema);