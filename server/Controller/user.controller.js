import { cloudinary } from "../app.js";

// Models
import User from "../Model/User.model.js";

export const updateProfile = async (req, res) => {
  const { profileUrl } = req.body;
  const { user } = req;

  if (!profileUrl) {
    return res.status(400).json({
      status: "fail",
      message: "Please select a profile Image!",
    });
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(profileUrl, {
      folder: "profile",
    });

    // If user already has a profile image, delete it from Cloudinary
    if (user.profileUrl) {
      // Extract the public ID from the existing Cloudinary URL
      const publicId = user.profileUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`profile/${publicId}`);
    }

    user.profileUrl = uploadResponse.secure_url;
    const updatedUser = await user.save();

    res.status(201).json({
      status: "success",
      data: updatedUser,
      message: "Profile Image uploaded successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

export const getReferrals = async (req, res) => {
  const { user } = req;

  try {
    const referrals = await User.aggregate([
      { $match: { invitedBy: user._id } }, // Filter referrals based on the inviter
      {
        $project: {
          email: {
            $let: {
              vars: {
                localEmail: "$email",
                localEmailLength: { $strLenCP: "$email" }, // Get the length of the email
                localAtIndex: { $indexOfBytes: ["$email", "@"] }, // Find the position of "@"
                localNameLength: {
                  $subtract: [{ $indexOfBytes: ["$email", "@"] }, 0],
                }, // Get length before "@"
              },
              in: {
                $concat: [
                  { $substr: ["$email", 0, 2] }, // Keep the first 2 characters
                  { $cond: [{ $gte: ["$$localNameLength", 4] }, "****", ""] }, // Mask part of the name before "@"
                  {
                    $substr: [
                      "$email",
                      "$$localAtIndex",
                      { $subtract: ["$$localEmailLength", "$$localAtIndex"] },
                    ],
                  }, // Keep the domain intact
                ],
              },
            },
          },
          firstPaid: 1,
          createdAt: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: referrals,
      message: "Referrals retrieved Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
