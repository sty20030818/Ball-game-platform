import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './database/models.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: 'D:/Desktop/Ball-game-platform/.env' });

async function initAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // 检查是否已存在管理员
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('管理员账号已存在');
      process.exit(0);
    }

    // 创建管理员账号
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL,
      role: 'admin'
    });

    await admin.save();
    console.log('管理员账号创建成功');
    process.exit(0);
  } catch (error) {
    console.error('初始化管理员失败:', error);
    process.exit(1);
  }
}

initAdmin();
