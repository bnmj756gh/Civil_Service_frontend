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
  I.see('Task Management System');
  I.see('Create New Task');
});

Then('I should be on the create task page', () => {
  I.seeInCurrentUrl('/tasks/create');
  I.see('Create New Task');
  I.see('Task Title');
});

Then('I should see the task details page', () => {
  I.seeInCurrentUrl('/tasks/');
  I.see('Status');
  I.see('Description');
});

// Form interaction steps
When('I fill in the task form with valid data', () => {
  I.fillField('title', 'Test Task Title');
  I.fillField('description', 'This is a test task description');
  I.selectOption('status', 'In Progress');

  // Try alternative approach for datetime-local input
  I.click('#dueDateTime');
  I.clearField('#dueDateTime');
  I.type('31122025');
  I.pressKey('Tab');
  I.type('1430');
});

When('I fill in the task form without a title', () => {
  I.fillField('title', '');
  I.fillField('description', 'Task without title');
  I.selectOption('status', 'In Progress');
});

When('I submit the task form', () => {
  I.click('Create Task');
});

// Task status steps
Given('I am viewing a task in IN_PROGRESS status', () => {
  I.amOnPage('/');
  // Create a task if none exist
  I.see('Create New Task');
  I.click('Create New Task');
  I.fillField('title', 'Test Task for Status Update');
  I.fillField('description', 'Test description');
  I.selectOption('status', 'In Progress');

  I.click('#dueDateTime');
  I.clearField('#dueDateTime');
  I.type('31122025');
  I.pressKey('Tab');
  I.type('1430');

  I.click('Create Task');
  I.waitInUrl('/', 5);
  I.click('View');
  I.waitForText('IN_PROGRESS', 5);
});

When('I change the status to COMPLETED', () => {
  I.click('Mark as Completed');
});

When('I submit the status change', () => {
  // Status change happens automatically when clicking Mark as Completed
});

// Delete steps
When('I click the delete button', () => {
  I.click('Delete Task');
});

When('I confirm the deletion', () => {
  I.acceptPopup();
});

// Success/Error verification steps
Then('I should be redirected to the task summary', () => {
  I.waitInUrl('/', 5);
});

Then('I should see a success message', () => {
  I.seeInCurrentUrl('success=Task%20created%20successfully');
});

Then('I should see an update success message', () => {
  I.seeInCurrentUrl('success=Task%20updated%20successfully');
});

Then('I should see a validation error', () => {
  I.waitForText('Title is required', 5);
});

Then('I should remain on the create task page', () => {
  I.see('Create New Task');
  I.see('Task Title');
});

Then('the page should include the task information', () => {
  I.see('Status');
  I.see('Description');
  I.see('Due Date');
});

Then('the task status should be updated', () => {
  I.waitForText('COMPLETED', 5);
});

Then('I should see a deletion success message', () => {
  I.seeInCurrentUrl('success=Task%20deleted%20successfully');
});

// Data setup steps
Given('there are existing tasks', () => {
  I.amOnPage('/');
  I.see('Task Management System');
  // First create a task if none exist
  I.see('Create New Task');
  I.click('Create New Task');
  I.fillField('title', 'Test Task for Viewing');
  I.fillField('description', 'Test description');
  I.selectOption('status', 'In Progress');

  I.click('#dueDateTime');
  I.clearField('#dueDateTime');
  I.type('31122025');
  I.pressKey('Tab');
  I.type('1430');

  I.click('Create Task');
  I.waitInUrl('/', 5);
});

Given('I am viewing a task', () => {
  I.amOnPage('/');
  // Create a task if none exist
  I.see('Create New Task');
  I.click('Create New Task');
  I.fillField('title', 'Test Task for Viewing');
  I.fillField('description', 'Test description');
  I.selectOption('status', 'In Progress');

  I.click('#dueDateTime');
  I.clearField('#dueDateTime');
  I.type('31122025');
  I.pressKey('Tab');
  I.type('1430');

  I.click('Create Task');
  I.waitInUrl('/', 5);
  I.click('View');
  I.see('Status');
});