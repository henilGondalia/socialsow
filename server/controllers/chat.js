import Chat from '../models/Chat.js';
import User from "../models/User.js";
import Message from "../models/Message.js";

export const fetchChat = async (req, res) => {
    try {
        let chat = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage").sort({ updatedAt: -1 })
        let user = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "firstName lastName picturePath email",
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

export const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        // find both user with latest messages
        let chat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user.id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        }).populate("users", "-password").populate("latestMessage");

        // Find user chat info
        chat = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "firstName lastName picturePath email",
        });

        // create and access one on one chat
        if (chat.length > 0) {
            res.send(chat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user.id, userId],
            };

            try {
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );
                res.status(200).json(FullChat);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const accessGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    // var users = JSON.parse(req.body.users);
    var users = req.body.users;
    if (users.length < 2) {
        return res
            .status(400)
            .json({ message: "More than 2 users are required to form a group chat" });
    }
    try {
        if (req.body.chatId) {
            const chat = await Chat.findById(req.body.chatId);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            // Check if the user is a group admin
            if (chat.groupAdmin.equals(req.user.id)) {
                return res.status(403).json({ message: "Cannot update group chat. User is not authorized." });
            }

            const updatedChat = await Chat.findByIdAndUpdate(
                req.body.chatId,
                {
                    chatName: req.body.name,
                    users: users,
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!updatedChat) {
                return res.status(404).json({ message: "Update failed" });
            }

            res.status(200).json(updatedChat);
        } else {
            users.push(req.user.id);

            const groupChat = await Chat.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user.id,
            });

            const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            res.status(200).json(fullGroupChat);
        }
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}

export const renameGroupChat = async (req, res) => {
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}

export const addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(added);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}

export const removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if the user is a group admin
        if (chat.groupAdmin.equals(userId)) {
            return res.status(403).json({ message: "Cannot remove group admin from the group" });
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(removed);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        var newMessage = {
            sender: req.user.id,
            content: content,
            chat: chatId,
        };
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "firstName lastName picturePath");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastName picturePath email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}

export const fetchAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "firstName lastName picturePath email")
            .populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
}
