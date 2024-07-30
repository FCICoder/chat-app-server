import User from "../models/UserModel.js";

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