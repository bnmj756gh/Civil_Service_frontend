import { Application, Request, Response } from 'express';
import { TaskService, CreateTaskRequest } from '../services/taskService';
import { HttpError } from '../errors/HttpError';

export default function (app: Application): void {
  const taskService = new TaskService();

  app.get('/tasks/create', async (req: Request, res: Response) => {
    try {
      const statusOptions = await taskService.getStatusOptions();
      res.render('tasks/create', {
        pageTitle: 'Create New Task',
        statusOptions: taskService.formatStatusOptionsForSelect(statusOptions),
        task: {}
      });
    } catch (error) {
      console.error('Error fetching status options:', error);
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      const errorMessage = error instanceof Error ? error.message : 'Failed to load create form';
      res.status(statusCode).render('error', {
        pageTitle: 'Error',
        error: errorMessage
      });
    }
  });

    // Create task - POST form submission
    app.post('/tasks', async (req: Request, res: Response) => {
      try {
        const taskData: CreateTaskRequest = {
          title: req.body.title,
          description: req.body.description || undefined,
          status: req.body.status || undefined,
          dueDateTime: req.body.dueDateTime || undefined
        };

        await taskService.createTask(taskData);

        // Redirect to summary with success message
        res.redirect('/?success=Task created successfully');
      } catch (error) {
        console.error('Error creating task:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create task';

        try {
          const statusOptions = await taskService.getStatusOptions();
          const statusCode = error instanceof HttpError ? error.statusCode : 500;
          res.status(statusCode).render('tasks/create', {
            pageTitle: 'Create New Task',
            statusOptions: taskService.formatStatusOptionsForSelect(statusOptions),
            task: req.body,
            error: errorMessage
          });
        } catch (statusError) {
          console.error('Error fetching status options for error page:', statusError);
          const statusCode = error instanceof HttpError ? error.statusCode : 500;
          res.status(statusCode).render('error', {
            pageTitle: 'Error',
            error: 'Failed to create task and could not reload form'
          });
        }
      }
    });

// View task details
  app.get('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      let task: any = null;
      let statusOptions: any[] = [];
      let error: string | undefined;

      // Fetch task
      try {
        task = await taskService.getTaskById(taskId);
      } catch (taskError) {
        console.error('Error fetching task:', taskError);
        error = taskError.message;
      }

      // Fetch status options
      try {
        statusOptions = await taskService.getStatusOptions();
      } catch (statusError) {
        console.error('Error fetching status options:', statusError);
        statusOptions = [];
      }

      // If no task found, show error page
      if (!task) {
        res.status(404).render('error', {
          pageTitle: 'Task Not Found',
          error: error || 'Task not found'
        });
        return;
      }

      // Render task details
      res.render('tasks/view', {
        pageTitle: `Task: ${task.title}`,
        task,
        statusOptions: taskService.formatStatusOptionsForSelect(statusOptions)
      });
    } catch (renderError) {
      console.error('Error rendering task details:', renderError);
      const statusCode = renderError instanceof HttpError ? renderError.statusCode : 500;
      res.status(statusCode).render('error', {
        pageTitle: 'Error',
        error: 'Failed to load task details'
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
      const status = req.body.status as string;

      await taskService.updateTaskStatus(taskId, status);

      // Redirect to task details with success message
      res.redirect(`/tasks/${taskId}?success=Task updated successfully`);
    } catch (error) {
      console.error('Error updating task status:', error);
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      res.status(statusCode).json({ error: errorMessage });
    }
  });

}
