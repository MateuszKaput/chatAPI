const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	image: {
		data: Buffer,
		type: String,
	},
});

const messageSchema = new mongoose.Schema({
	owner: mongoose.SchemaTypes.ObjectId,
	sendTime: {
		type: Date,
		default: () => Date.now(),
	},
	messageContent: {
		text: String,
		image: imageSchema,
	},
});

module.exports = mongoose.model('Message', messageSchema);
