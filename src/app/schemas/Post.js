import mongoose from "../../database/index.js";
import Slugify from "../../utils/Slugify.js";

const PostSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    featuredImage: {
        type: String,
        // required: true,
    },
    images: [
        {
            type: String,
        }
    ],
    username: {
        type: String,
        required: true,
    },
    userPhoto: {
        type: String, 
    },
    userNumber: {
        type: Number,
        required: true,
    },
    petName: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

PostSchema.pre('save', function (next) {
    const description = this.description;
    this.slug = Slugify(description);
    next();
})

export default mongoose.model("Post", PostSchema);