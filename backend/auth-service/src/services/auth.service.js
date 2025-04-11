import prisma from "../common/prisma/init.prisma.js";
import jwt from "jsonwebtoken";

const authService = {
  login: async (req) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      throw new Error("Thiếu thông tin đăng nhập");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new Error("Thông tin đăng nhập không hợp lệ");
    }

    // Check if password is correct
    if (user.password !== password) {
      throw new Error("Thông tin đăng nhập không hợp lệ");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  },
};

export default authService;
