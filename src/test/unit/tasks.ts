import { TaskService, Task, CreateTaskRequest, TaskStatusOption } from '../../main/services/taskService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks successfully', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: 'IN_PROGRESS',
          dueDateTime: '2024-01-01T10:00:00Z'
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockTasks });

      const result = await taskService.getAllTasks();

      expect(result).toEqual(mockTasks);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks');
    });

    it('should handle server error', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Server error' }
        }
      };

      mockedAxios.get.mockRejectedValue(errorResponse);

      try {
        await taskService.getAllTasks();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Server error');
      }
    });

    it('should handle network error', async () => {
      const networkError = {
        request: {}
      };

      mockedAxios.get.mockRejectedValue(networkError);

      try {
        await taskService.getAllTasks();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Unable to connect to the service. Please try again later.');
      }
    });
  });

  describe('getTaskById', () => {
    it('should return task by id successfully', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        dueDateTime: '2024-01-01T10:00:00Z'
      };

      mockedAxios.get.mockResolvedValue({ data: mockTask });

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(mockTask);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1');
    });

    it('should handle task not found error', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Task not found' }
        }
      };

      mockedAxios.get.mockRejectedValue(errorResponse);

      try {
        await taskService.getTaskById(999);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Task not found');
      }
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const createRequest: CreateTaskRequest = {
        title: 'New Task',
        description: 'New Description',
        status: 'IN_PROGRESS',
        dueDateTime: '2024-01-01T10:00:00Z'
      };

      const mockCreatedTask: Task = {
        id: 1,
        ...createRequest
      };

      mockedAxios.post.mockResolvedValue({ data: mockCreatedTask });

      const result = await taskService.createTask(createRequest);

      expect(result).toEqual(mockCreatedTask);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:4000/api/tasks', createRequest);
    });

    it('should handle validation error', async () => {
      const createRequest: CreateTaskRequest = {
        title: '',
        status: 'IN_PROGRESS'
      };

      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Title is required' }
        }
      };

      mockedAxios.post.mockRejectedValue(errorResponse);

      try {
        await taskService.createTask(createRequest);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Title is required');
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await taskService.deleteTask(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1');
    });

    it('should handle delete error', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Task not found' }
        }
      };

      mockedAxios.delete.mockRejectedValue(errorResponse);

      try {
        await taskService.deleteTask(999);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Task not found');
      }
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const updatedTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'COMPLETED',
        dueDateTime: '2024-01-01T10:00:00Z'
      };

      mockedAxios.patch.mockResolvedValue({ data: updatedTask });

      const result = await taskService.updateTaskStatus(1, 'COMPLETED');

      expect(result).toEqual(updatedTask);
      expect(mockedAxios.patch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1/status', { status: 'COMPLETED' });
    });
  });

  describe('getStatusOptions', () => {
    it('should return status options successfully', async () => {
      const mockStatusOptions: TaskStatusOption[] = [
        { id: 1, code: 'IN_PROGRESS', displayName: 'In Progress' },
        { id: 2, code: 'COMPLETED', displayName: 'Completed' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockStatusOptions });

      const result = await taskService.getStatusOptions();

      expect(result).toEqual(mockStatusOptions);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks/status-options');
    });
  });

  describe('getStatusDisplayName', () => {
    it('should return display name for existing status', () => {
      const statusOptions: TaskStatusOption[] = [
        { id: 1, code: 'IN_PROGRESS', displayName: 'In Progress' },
        { id: 2, code: 'COMPLETED', displayName: 'Completed' }
      ];

      const result = taskService.getStatusDisplayName('IN_PROGRESS', statusOptions);

      expect(result).toBe('In Progress');
    });

    it('should return code for non-existing status', () => {
      const statusOptions: TaskStatusOption[] = [
        { id: 1, code: 'IN_PROGRESS', displayName: 'In Progress' }
      ];

      const result = taskService.getStatusDisplayName('UNKNOWN', statusOptions);

      expect(result).toBe('UNKNOWN');
    });
  });

  describe('formatStatusOptionsForSelect', () => {
    it('should format status options for select dropdown', () => {
      const statusOptions: TaskStatusOption[] = [
        { id: 1, code: 'IN_PROGRESS', displayName: 'In Progress' },
        { id: 2, code: 'COMPLETED', displayName: 'Completed' }
      ];

      const result = taskService.formatStatusOptionsForSelect(statusOptions);

      expect(result).toEqual([
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' }
      ]);
    });
  });
});
