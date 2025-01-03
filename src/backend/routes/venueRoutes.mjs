import express from 'express';
import { Venue } from '../database/models.mjs';
import authMiddleware, { authorize } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// 创建场地
router.post('/', authMiddleware, authorize(['admin']), async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 获取场地列表
router.get('/', async (req, res) => {
  try {
    const { location, capacity, facilities } = req.query;
    const filter = {};

    if (location) filter.address = { $regex: location, $options: 'i' };
    if (capacity) filter.capacity = { $gte: capacity };
    if (facilities) filter.facilities = { $all: facilities.split(',') };

    const venues = await Venue.find(filter).sort({ createdAt: -1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个场地详情
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: '场地未找到' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 更新场地信息
router.put('/:id', authMiddleware, authorize(['admin']), async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!venue) {
      return res.status(404).json({ message: '场地未找到' });
    }

    res.json(venue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除场地
router.delete('/:id', authMiddleware, authorize(['admin']), async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: '场地未找到' });
    }

    res.json({ message: '场地已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 预约场地
router.post('/:id/book', authMiddleware, async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: '场地未找到' });
    }

    // 检查时间冲突
    const isConflict = venue.availableTimes.some(time => {
      const bookingTime = new Date(time);
      return bookingTime >= new Date(startTime) && bookingTime <= new Date(endTime);
    });

    if (isConflict) {
      return res.status(400).json({ message: '该时间段已被预约' });
    }

    // 添加预约时间
    venue.availableTimes.push(startTime);
    await venue.save();

    res.json({ message: '场地预约成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
