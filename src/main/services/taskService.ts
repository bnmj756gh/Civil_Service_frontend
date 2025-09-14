import axios, { AxiosResponse } from 'axios';
import { HttpError } from '../errors/HttpError';
// import config from 'config';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDateTime?: string;
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
      throw HttpError.fromAxiosError(error);
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw HttpError.fromAxiosError(error);
    }
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.post(this.baseUrl, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw HttpError.fromAxiosError(error);
    }
  }


  async getStatusOptions(): Promise<TaskStatusOption[]> {
    try {
      const response: AxiosResponse<TaskStatusOption[]> = await axios.get(`${this.baseUrl}/status-options`);
      return response.data;
    } catch (error) {
      console.error('Error fetching status options:', error);
      throw HttpError.fromAxiosError(error);
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw HttpError.fromAxiosError(error);
    }
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    try {
      const statusData: UpdateTaskStatusRequest = { status };
      const response: AxiosResponse<Task> = await axios.patch(`${this.baseUrl}/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id} status:`, error);
      throw HttpError.fromAxiosError(error);
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
