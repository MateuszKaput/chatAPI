const express = require('express');
const connectDB = require('./config/db');
const User = require('./schemats/User.js');
const Chat = require('./schemats/Chat.js');
const Message = require('./schemats/Message.js');
const multer = require('multer');
const app = express();
connectDB();
app.use(express.json());

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './backend/images');
	},

	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	},
});
const upload = multer({ storage: storage });

app.post('/user', (req, res) => {
	try {
		createUserInDatabase(req.body).then(function (user) {
			return res.status(201).send(user);
		});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

app.post('/chat', (req, res) => {
	try {
		createChatForUsers(req.body).then(function (chat) {
			return res.status(201).send(chat);
		});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

app.patch('/chat/:_id', upload.single('image'), (req, res) => {
	try {
		console.log(req.file);
		const _id = req.params._id;
		addMessageToChat(req.body, _id, req.file).then((data) => {
			return res.status(200).send(data);
		});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

app.patch('/chat/:_id/:id', (req, res) => {
	try {
		const chatId = req.params._id;
		const messageId = req.params.id;
		editMessageOnChat(req.body, chatId, messageId).then((data) => {
			return res.status(200).send(data);
		});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

app.delete('/chat/:_id/:id', (req, res) => {
	try {
		const chatId = req.params._id;
		const messageId = req.params.id;
		deleteMessage(chatId, messageId).then((data) => {
			return res.status(200).send(data);
		});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

app.post('/img', upload.single('image'), (req, res) => {
	res.send('Single upload done');
});

app.get('/chat/:_id', (req, res) => {
	try {
		const _id = req.params._id;
		getChat(_id)
			.then((data) => {
				return res.status(data.status).send(data.data);
			})
			.catch((error) => {
				return res.status(error.status).send(error.message);
			});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

app.get('/users', (req, res) => {
	try {
		getUsers()
			.then((data) => {
				return res.status(200).send(data);
			})
			.catch((error) => {
				return res.status(400).send(error.message);
			});
	} catch (error) {
		return res.status(400).send('Coś nie tak mordko');
	}
});

async function createUserInDatabase(body) {
	try {
		const user = await User.create({
			userName: body.userName,
		});
		return user;
	} catch (e) {
		console.log(e.message);
	}
}

async function createChatForUsers(body) {
	try {
		const chat = await Chat.create({
			users: {
				user1: body.users.user1,
				user2: body.users.user2,
			},
		});
		return chat;
	} catch (e) {
		console.log(e.message);
	}
}

async function getChat(_id) {
	try {
		const chat = await Chat.findById(_id);
		return { status: 200, data: chat };
	} catch (error) {
		return { status: 404, data: 'Brak czatu o takim ID' };
	}
}

async function addMessageToChat(data, _id, file) {
	if (data.message) {
		const message = {
			owner: data.owner,
			messageContent: {
				text: data.messages.messageContent.text,
			},
		};
		const result = await Chat.findByIdAndUpdate(_id, { $push: { messages: message } });
	} else {
		const message = {
			owner: data.owner,
			messageContent: {
				image: {
					data: file.filename,
					contentType: 'image/JPEG',
				},
			},
		};
		console.log(data);
		const result = await Chat.findByIdAndUpdate(_id, { $push: { messages: message } });
	}
}

async function editMessageOnChat(data, chatId, messageId) {
	const chat = await Chat.findById(chatId);
	chat.messages.map((item) => {
		if (item.id === messageId) {
			console.log((item.messageContent.text = data.text));
			chat.save();
		}
	});
}
async function deleteMessage(chatId, messageId) {
	const chat = await Chat.findOneAndUpdate({ _id: chatId }, { $pull: { messages: { _id: messageId } } }, { new: true });
}

async function getUsers() {
	const users = await User.find({});
	return users;
}

app.listen(3000);
