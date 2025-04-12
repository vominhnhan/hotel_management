import prisma from "../common/prisma/init.prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authService = {
  register: async (req) => {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      throw new Error("Thiếu thông tin đăng ký");
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExists) {
      throw new Error("Tài khoản đã tồn tại");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        role: role,
      },
    });

    delete newUser.password;

    return newUser;
  },

  login: async (req) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new Error("Thiếu thông tin đăng nhập");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
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
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  },
};

export default authService;
