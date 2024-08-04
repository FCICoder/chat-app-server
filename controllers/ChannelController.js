import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    console.log(name, members, "HIIIIIIIIII");

    const userId = req.userId;
    const admin = await User.findById(userId);

    if (!admin) return res.status(400).send("Admin user not found.");

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length)
      return res.status(400).send("Some Members are not valid users.");

    const newChannel = new Channel({ name, members, admin: userId });
    await newChannel.save();

    return res.status(201).json({ Channel: newChannel });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ members: userId }, { admin: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({ channels });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

export const getCHannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) return res.status(404).send("Channel not found");
    const messages = channel.messages;

    return res.status(201).json({ messages });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};
