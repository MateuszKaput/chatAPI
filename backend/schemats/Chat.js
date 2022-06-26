const mongoose = require('mongoose');
const Message = require('./Message.js');

const chatSchema = new mongoose.Schema({
	test: String,
	users: {
		user1: mongoose.SchemaTypes.ObjectId,
		user2: mongoose.SchemaTypes.ObjectId,
	},
	messages: [Message.schema],
});

module.exports = mongoose.model('Chat', chatSchema);
