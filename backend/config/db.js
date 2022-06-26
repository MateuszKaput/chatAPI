const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://admin:admin123@cluster0.b242jtz.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI, {});
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit();
	}
};

module.exports = connectDB;
