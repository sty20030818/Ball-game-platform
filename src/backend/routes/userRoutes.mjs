import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../database/models.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: 'D:/Desktop/Ball-game-platform/.env' });

const router = express.Router();

// 统一登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查密码是否正确
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '密码错误'
      });
    }

    // 检查是否为管理员
    const isAdmin = email === process.env.ADMIN_EMAIL &&
                   password === process.env.ADMIN_PASSWORD;

    // 生成JWT
    const role = isAdmin ? 'admin' : 'user';
    const token = jwt.sign(
      { userId: user._id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      message: '登录成功',
      token,
      user: {
        email,
        role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      message: error.message || '服务器错误',
      error: error.stack
    });
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // 检查用户名、邮箱、手机号是否已存在
    const existingUser = await User.findOne({
      $or: [
        { username },
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      let message = '注册失败：';
      if (existingUser.username === username) {
        message += '用户名已存在';
      } else if (existingUser.email === email) {
        message += '邮箱已注册';
      } else if (existingUser.phone === phone) {
        message += '手机号已注册';
      }
      return res.status(400).json({ message });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phone,
      creditScore: 100,
      memberLevel: 'bronze',
      createdAt: new Date(),
      status: 'active'
    });

    await newUser.save();

    res.status(201).json({ message: '用户注册成功', userId: newUser._id });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
