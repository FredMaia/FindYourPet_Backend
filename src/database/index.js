import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;
export default mongoose;