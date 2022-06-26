const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: String,
	chats: {
		chatId: mongoose.SchemaTypes.ObjectId,
	},
});

module.exports = mongoose.model('User', userSchema);
