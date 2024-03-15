import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // To avoid warnings in the console
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true
        });

        console.log(`MongoDB Connected: "Đã kết nối thành công với DB" ${conn.connection.host}`);
    }catch (error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;