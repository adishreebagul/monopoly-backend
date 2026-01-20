import User from "../models/User.js";

export const syncUser = async (req, res) => {
  try {
    const { uid, email } = req.user;

    let user = await User.findOne({ firebaseId: uid });

    if (!user) {
      user = await User.create({
        firebaseId: uid,
        email: email,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "User sync failed", error });
  }
};
