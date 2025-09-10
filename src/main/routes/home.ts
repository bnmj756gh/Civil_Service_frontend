import { Application } from 'express';
import { TaskService } from '../services/taskService';

export default function (app: Application): void {
  const taskService = new TaskService();

  app.get('/', async (req, res) => {
    try {
      const tasks = await taskService.getAllTasks();

      res.render('tasks/summary', {
        tasks,
        statusOptions: taskService.getStatusOptions(),
        pageTitle: 'Task Summary'
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.render('tasks/summary', {
        tasks: [],
        error: error instanceof Error ? error.message : 'Failed to load tasks',
        statusOptions: taskService.getStatusOptions(),
        pageTitle: 'Task Summary'
      });
    }
  });
}

