import axios, { AxiosResponse } from 'axios';
// import config from 'config';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDateTime?: string;
  createdDate: string;
  updatedDate: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: string;
  dueDateTime?: string;
}

export interface UpdateTaskStatusRequest {
  status: string;
}

export interface TaskStatusOption {
  id: number;
  code: string;
  displayName: string;
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

  async getStatusOptions(): Promise<TaskStatusOption[]> {
    try {
      const response: AxiosResponse<TaskStatusOption[]> = await axios.get(`${this.baseUrl}/status-options`);
      return response.data;
    } catch (error) {
      console.error('Error fetching status options:', error);
      throw this.handleError(error);
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

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    try {
      const statusData: UpdateTaskStatusRequest = { status };
      const response: AxiosResponse<Task> = await axios.patch(`${this.baseUrl}/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id} status:`, error);
      throw this.handleError(error);
    }
  }

  getStatusDisplayName(status: string, statusOptions: TaskStatusOption[]): string {
    const option = statusOptions.find(opt => opt.code === status);
    return option ? option.displayName : status;
  }

  formatStatusOptionsForSelect(statusOptions: TaskStatusOption[]): { value: string; label: string }[] {
    return statusOptions.map(option => ({
      value: option.code,
      label: option.displayName
    }));
  }
}
