import { app } from '../../main/app';
import request from 'supertest';
import axios from 'axios';

// Integration tests - testing frontend + backend + database together
describe('Task Integration Tests', () => {
  const baseUrl = 'http://localhost:4000/api/tasks';

  beforeAll(async () => {
    // Verify backend is running
    try {
      await axios.get(`${baseUrl}/status-options`);
    } catch (error) {
      throw new Error('Backend must be running on localhost:4000 for integration tests');
    }
  });

  describe('GET / - Task Summary Integration', () => {
    it('should display task summary page successfully', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Task Management System');
      expect(response.type).toMatch(/html/);
    });
  });

  describe('GET /tasks/create - Create Form Integration', () => {
    it('should load create form with status options', async () => {
      const response = await request(app)
        .get('/tasks/create')
        .expect(200);

      expect(response.text).toContain('Create New Task');
      expect(response.type).toMatch(/html/);
    });
  });

  describe('POST /tasks - Create Task Integration', () => {
    it('should create task successfully with valid data', async () => {
      const taskData = {
        title: 'Integration Test Task',
        description: 'Testing full stack integration',
        status: 'IN_PROGRESS',
        dueDateTime: '2024-12-31T10:00'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      // Backend working correctly - should redirect on success
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/');
    });

    it('should return validation error for empty title', async () => {
      const invalidTaskData = {
        title: '',
        description: 'Test',
        status: 'IN_PROGRESS'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTaskData);

      // Backend should return proper validation error
      expect(response.status).toBe(400);
    });

    it('should return validation error for invalid status', async () => {
      const invalidTaskData = {
        title: 'Test Task',
        description: 'Test',
        status: 'INVALID_STATUS'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTaskData);

      // Backend should return proper validation error
      expect(response.status).toBe(400);
    });

    it('should return validation error for missing required fields', async () => {
      const invalidTaskData = {
        description: 'Test'
        // Missing title and status
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTaskData);

      // Backend should return proper validation error
      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks/:id - View Task Integration', () => {
    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/tasks/99999');

      // Backend should return proper 404 error
      expect(response.status).toBe(404);
    });
  });

  describe('Full Workflow Integration', () => {
    it('should complete create -> redirect workflow', async () => {
      // Step 1: Load create form
      const createFormResponse = await request(app)
        .get('/tasks/create')
        .expect(200);

      expect(createFormResponse.text).toContain('Create New Task');

      // Step 2: Submit valid task creation
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Workflow Test Task',
          description: 'Testing complete workflow',
          status: 'IN_PROGRESS',
          dueDateTime: '2024-12-31T10:00'
        });

      // Backend working correctly - should redirect
      expect(createResponse.status).toBe(302);
      expect(createResponse.headers.location).toContain('/');

      // Step 3: Verify redirect to task summary
      const summaryResponse = await request(app)
        .get('/')
        .expect(200);

      expect(summaryResponse.text).toContain('Task Management System');
    });
  });


});
