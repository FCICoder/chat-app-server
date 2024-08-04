import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res) => {
    console.log('😀😀');
    try {
        console.log('HIIII');
        
      const {name , members} = req.body;
      console.log(name , members , "HIIIIIIIIII");
      
      const userId = req.userId;
      const admin = await User.findById(userId);

      if(!admin) return res.status(400).send("Admin user not found.");

      const validMembers = await User.find({_id: {$in: members}});
      if(validMembers.length!== members.length) return res.status(400).send("Some Members are not valid users.");

      const newChannel = new Channel({name, members, admin: userId});
      await newChannel.save();

      return res.status(201).json({Channel: newChannel});
      
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  };

  export const getUserChannels = async (req, res) => {
    console.log('😀😀');
    try {
             
      const userId = new mongoose.Types.ObjectId(req.userId);
      const channels = await Channel.find({
        $or: [{members: userId}, {admin: userId}]
      }).sort({updatedAt: -1});

      return res.status(201).json({channels});
      
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  };