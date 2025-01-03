import express from 'express';
import { Activity } from '../database/models.mjs';
import authenticate from '../middleware/authMiddleware.mjs';

const router = express.Router();

// 创建活动
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, location, date, type, maxParticipants, fee } = req.body;

    const newActivity = new Activity({
      title,
      description,
      location,
      date,
      type,
      maxParticipants,
      fee,
      organizer: req.user._id,
      status: 'pending'
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: '创建活动失败', error: error.message });
  }
});

// 获取活动列表
router.get('/', async (req, res) => {
  try {
    const { type, status, organizer } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (organizer) filter.organizer = organizer;

    const activities = await Activity.find(filter)
      .populate('organizer', 'username')
      .sort({ date: 1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: '获取活动列表失败', error: error.message });
  }
});

// 获取单个活动详情
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('organizer', 'username')
      .populate('participants', 'username')
      .populate('comments.user', 'username');

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: '获取活动详情失败', error: error.message });
  }
});

// 更新活动信息
router.put('/:id', authenticate, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (activity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权修改此活动' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: '更新活动失败', error: error.message });
  }
});

// 删除活动
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (activity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权删除此活动' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: '活动删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除活动失败', error: error.message });
  }
});

// 报名参加活动
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (activity.participants.includes(req.user._id)) {
      return res.status(400).json({ message: '您已报名此活动' });
    }

    if (activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: '活动人数已满' });
    }

    activity.participants.push(req.user._id);
    await activity.save();

    res.json({ message: '报名成功', activity });
  } catch (error) {
    res.status(500).json({ message: '报名失败', error: error.message });
  }
});

// 取消报名
router.post('/:id/leave', authenticate, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (!activity.participants.includes(req.user._id)) {
      return res.status(400).json({ message: '您未报名此活动' });
    }

    activity.participants = activity.participants.filter(
      participant => participant.toString() !== req.user._id.toString()
    );
    await activity.save();

    res.json({ message: '取消报名成功', activity });
  } catch (error) {
    res.status(500).json({ message: '取消报名失败', error: error.message });
  }
});

// 添加评论
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    activity.comments.push({
      user: req.user._id,
      content
    });

    await activity.save();
    res.json({ message: '评论添加成功', activity });
  } catch (error) {
    res.status(500).json({ message: '添加评论失败', error: error.message });
  }
});

// 更新活动状态
router.post('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (activity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权修改此活动状态' });
    }

    activity.status = status;
    await activity.save();

    res.json({ message: '活动状态更新成功', activity });
  } catch (error) {
    res.status(500).json({ message: '更新活动状态失败', error: error.message });
  }
});

// 添加活动评分
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (!activity.participants.includes(req.user._id)) {
      return res.status(403).json({ message: '只有参与者可以评分' });
    }

    const newAverage = (activity.rating.average * activity.rating.count + rating) /
                      (activity.rating.count + 1);

    activity.rating = {
      average: newAverage,
      count: activity.rating.count + 1
    };

    await activity.save();
    res.json({ message: '评分成功', activity });
  } catch (error) {
    res.status(500).json({ message: '评分失败', error: error.message });
  }
});

// 添加活动提醒
router.post('/:id/reminders', authenticate, async (req, res) => {
  try {
    const { time } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: '活动未找到' });
    }

    if (!activity.participants.includes(req.user._id)) {
      return res.status(403).json({ message: '只有参与者可以设置提醒' });
    }

    activity.reminders.push({
      user: req.user._id,
      time: new Date(time)
    });

    await activity.save();
    res.json({ message: '提醒设置成功', activity });
  } catch (error) {
    res.status(500).json({ message: '设置提醒失败', error: error.message });
  }
});

export default router;
