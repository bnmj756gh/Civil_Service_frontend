import { Application, Request, Response } from 'express';
import { TaskService, TaskStatus, CreateTaskRequest } from '../services/taskService';

export default function (app: Application): void {
  const taskService = new TaskService();

  // Create task - GET form
  app.get('/tasks/create', (req: Request, res: Response) => {
    res.render('tasks/create', {
      pageTitle: 'Create New Task',
      statusOptions: taskService.getStatusOptions(),
      task: {}
    });
  });

  // Create task - POST form submission
  app.post('/tasks', async (req: Request, res: Response) => {
    try {
      const taskData: CreateTaskRequest = {
        title: req.body.title,
        description: req.body.description || undefined,
        status: req.body.status as TaskStatus || TaskStatus.IN_PROGRESS,
        dueDateTime: req.body.dueDateTime || undefined
      };

      await taskService.createTask(taskData);

      // Redirect to summary with success message
      res.redirect('/?success=Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';

      res.render('tasks/create', {
        pageTitle: 'Create New Task',
        statusOptions: taskService.getStatusOptions(),
        task: req.body,
        error: errorMessage
      });
    }
  });

// View task details
  app.get('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await taskService.getTaskById(taskId);

      res.render('tasks/view', {
        pageTitle: `Task: ${task.title}`,
        task,
        statusOptions: taskService.getStatusOptions()
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load task';

      res.render('error', {
        pageTitle: 'Task Not Found',
        error: errorMessage
      });
    }
  });

// Delete task
  app.post('/tasks/:id/delete', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      await taskService.deleteTask(taskId);

      // Redirect to dashboard with success message
      res.redirect('/?success=Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';

      // Redirect back with error message
      res.redirect(`/tasks/${req.params.id}?error=${encodeURIComponent(errorMessage)}`);
    }
  });

  // Update task status
  app.post('/tasks/:id/status', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const status = req.body.status as TaskStatus;

      await taskService.updateTaskStatus(taskId, status);

      // Redirect to task details with success message
      res.redirect(`/tasks/${taskId}?success=Task updated successfully`);
    } catch (error) {
      console.error('Error updating task status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      res.status(400).json({ error: errorMessage });
    }
  });

}
