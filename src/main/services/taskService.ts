import axios, { AxiosResponse } from 'axios';
// import config from 'config';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDateTime?: string;
  createdDate: string;
  updatedDate: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDateTime?: string;
}

export enum TaskStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export class TaskService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.TASK_API_URL || 'http://localhost:4000/api/tasks';
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      const response: AxiosResponse<Task[]> = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw this.handleError(error);
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw this.handleError(error);
    }
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.post(this.baseUrl, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Unable to connect to the task service. Please try again later.');
    } else {
      // Request setup error
      return new Error('An unexpected error occurred. Please try again.');
    }
  }

  getStatusDisplayName(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw this.handleError(error);
    }
  }

  getStatusOptions(): { value: TaskStatus; label: string }[] {
    return [
      { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
      { value: TaskStatus.COMPLETED, label: 'Completed' }
    ];
  }
}
