import { Point } from '../database/models.mjs';

// 获取用户积分
export const getPointsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const points = await Point.findOne({ userId });
    res.status(200).json(points);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 添加积分
export const addPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;
    const point = await Point.findOneAndUpdate(
      { userId },
      { $inc: { balance: points } },
      { new: true, upsert: true }
    );
    res.status(200).json(point);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 扣除积分
export const deductPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;
    const point = await Point.findOneAndUpdate(
      { userId },
      { $inc: { balance: -points } },
      { new: true }
    );
    res.status(200).json(point);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
