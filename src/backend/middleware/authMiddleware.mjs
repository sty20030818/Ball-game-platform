import jwt from 'jsonwebtoken';
import { User } from '../database/models.mjs';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '请先登录' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: '用户未找到' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '无权限访问' });
    }
    next();
  };
};

export { authMiddleware as default, authorize };
