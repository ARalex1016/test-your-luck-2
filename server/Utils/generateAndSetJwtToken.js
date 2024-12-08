import jwt from "jsonwebtoken";

export const generateAndSetJwtToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id, userRole: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.LOGIN_EXPIRES,
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    // sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};
