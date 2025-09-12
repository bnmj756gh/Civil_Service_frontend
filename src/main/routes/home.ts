import { Application } from 'express';
import { TaskService } from '../services/taskService';

export default function (app: Application): void {
  const taskService = new TaskService();

  app.get('/', async (req, res) => {
      let tasks: any[] = [];
      let error: string | undefined;

      // Fetch tasks
      try {
        tasks = await taskService.getAllTasks();
      } catch (taskError) {
        console.error('Error fetching tasks:', taskError);
        error =  taskError.message;
      }

      res.render('tasks/summary', {
        tasks,
        pageTitle: 'Task Summary',
        error
      });
  });
}
