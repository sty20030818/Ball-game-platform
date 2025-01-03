import express from 'express';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import { promisify } from 'util';
import userRoutes from './routes/userRoutes.mjs';
import activityRoutes from './routes/activityRoutes.mjs';
const execAsync = promisify(exec);

// 连接MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

const PORT = 5000;

async function checkPort(port) {
  try {
    // 使用tasklist命令替代netstat
    const { stdout } = await execAsync(`netstat -aon | findstr :${port}`);

    if (!stdout) return null;

    const lines = stdout.trim().split('\n');
    for (const line of lines) {
      const columns = line.trim().split(/\s+/);
      if (columns.length >= 5 && columns[1].endsWith(`:${port}`)) {
        const pid = columns[columns.length - 1];
        if (pid && pid !== '0') {
          return pid;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('端口检查失败，继续启动服务器...');
    return null;
  }
}

async function killProcess(pid) {
  try {
    if (!pid || pid === '0') {
      console.error('Invalid process ID');
      return false;
    }

    const { stdout, stderr } = await execAsync(`taskkill /PID ${pid} /F`);

    if (stderr) {
      console.error(`Error killing process ${pid}:`, stderr);
      return false;
    }

    console.log(`Successfully killed process ${pid}`);
    return true;
  } catch (error) {
    console.error(`Failed to kill process ${pid}:`, error.message);
    return false;
  }
}

async function startServer() {
  await connectDB();
  const app = express();

  // 解析JSON请求体
  app.use(express.json());

  // 挂载用户路由
  app.use('/api/users', userRoutes);

  // 挂载活动路由
  app.use('/api/activities', activityRoutes);

  // 根路由
  app.get('/', (req, res) => {
    res.send('欢迎进入约球管理系统！');
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

async function main() {
  const pid = await checkPort(PORT);

  if (pid) {
    console.log(`Port ${PORT} is in use by process ${pid}, attempting to kill...`);
    const killed = await killProcess(pid);
    if (!killed) {
      console.error(`Failed to kill process ${pid}`);
      process.exit(1);
    }
    console.log(`Process ${pid} killed successfully`);
  }

  console.log('Starting server...');
  await startServer();
}

main().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
