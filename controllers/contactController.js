import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (req, res) => {
    try {
      const {searchTerm  } = req.body;
      if(!searchTerm) res.status(400).send('SearchTerm is required');

        const sanitizedSearchTerm = searchTerm.replace(
            /[-[\]{}()*+?.,\\^$|#\s]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchTerm, 'i');

        const contacts = await User.find({
            $and:[{ _id:{ $ne: req.userId }} , {
                $or: [{ firstName: regex} , { lastName: regex} , { email: regex}]
            }],
        })

      return res.status(200).json({contacts});
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  };


export const getContactForDMList = async (req, res) => {
    try {
      let {userId} = req;
      userId = new mongoose.Types.ObjectId(userId);
      const contacts = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { recipient: userId }]
          },
        },
        {
          $sort:{timeStamp: -1},
        },
        {
          $group: {
            _id:{
              $cond:{
                if: {$eq: ['$sender' , userId]},
                then: '$recipient',
                else: '$sender'
              }
            },
            lastMessageTime: {$first : "$timeStamp"}, 
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'contactInfo',
          },
        },
        {
          $unwind: '$contactInfo',
        },
        {
          $project: {
            _id: 1,
            contactId: '$contactInfo._id',
            email: '$contactInfo.email',
            firstName: '$contactInfo.firstName',
            lastName: '$contactInfo.lastName',
            image: '$contactInfo.image',
            color: '$contactInfo.color',
            lastMessageTime: 1,
          },
        },
        {
          $sort: {lastMessageTime: -1},
        }
      ])

      return res.status(200).json({contacts});

    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  };

export const getAllContacts = async (req, res) => {
    try {
      const users =await User.find({_id: {$ne :req.userId}}, "firstName lastName _id email");
      const contacts  =  users.map((user) => ({
        label : user.firstName ?`${user.firstName} ${user.lastName}` : user.email ,
        value: user._id
      }))

      return res.status(200).json({contacts});
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  };