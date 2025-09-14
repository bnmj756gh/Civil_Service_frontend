import { config as testConfig } from '../config';

const { I } = inject();

// Background steps
Given('the application is running', () => {
  I.amOnPage('/');
});

// Navigation steps
Given('I am on the create task page', () => {
  I.amOnPage('/tasks/create');
});

When('I click on create new task', () => {
  I.click('Create New Task');
});

When('I click on a task', () => {
  I.click('View');
});

// Page verification steps
Then('I should see the task summary page', () => {
  I.seeInCurrentUrl('/');
  I.waitForElement('[data-testid="task-summary"]', 5);
});

Then('I should be on the create task page', () => {
  I.seeInCurrentUrl('/tasks/create');
  I.waitForElement('[data-testid="create-task-form"]', 5);
});

Then('I should see the task details page', () => {
  I.seeInCurrentUrl('/tasks/');
  I.waitForElement('[data-testid="task-details"]', 5);
});

// Form interaction steps
When('I fill in the task form with valid data', () => {
  I.fillField('title', 'Test Task Title');
  I.fillField('description', 'This is a test task description');
  I.selectOption('status', 'IN_PROGRESS');
  I.fillField('dueDateTime', '2024-12-31T10:00');
});

When('I fill in the task form without a title', () => {
  I.fillField('title', '');
  I.fillField('description', 'Task without title');
  I.selectOption('status', 'IN_PROGRESS');
});

When('I submit the task form', () => {
  I.click('Create Task');
});

// Task status steps
Given('I am viewing a task in IN_PROGRESS status', () => {
  I.amOnPage('/tasks/1');
  I.waitForText('IN_PROGRESS', 5);
});

When('I change the status to COMPLETE', () => {
  I.selectOption('status', 'COMPLETE');
});

When('I submit the status change', () => {
  I.click('Update Status');
});

// Delete steps
When('I click the delete button', () => {
  I.click('Delete Task');
});

When('I confirm the deletion', () => {
  I.click('Confirm Delete');
});

// Success/Error verification steps
Then('I should be redirected to the task summary', () => {
  I.waitInUrl('/', 5);
});

Then('I should see a success message', () => {
  I.waitForText('success', 5);
});

Then('I should see a validation error', () => {
  I.waitForText('required', 5);
});

Then('I should remain on the create task page', () => {
  I.seeInCurrentUrl('/tasks/create');
});

Then('the page should include the task information', () => {
  I.waitForElement('[data-testid="task-title"]', 5);
  I.waitForElement('[data-testid="task-status"]', 5);
});

Then('the task status should be updated', () => {
  I.waitForText('COMPLETE', 5);
});

Then('I should see a deletion success message', () => {
  I.waitForText('deleted successfully', 5);
});

// Data setup steps
Given('there are existing tasks', () => {
  // This step assumes tasks exist or we could create them
  I.amOnPage('/');
  I.waitForElement('[data-testid="task-list"]', 10);
});
