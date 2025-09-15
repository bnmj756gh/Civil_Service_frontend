const { I } = inject();

// Error scenario steps
When('I submit the form with invalid data', () => {
  I.fillField('title', ''); // Empty title
  I.fillField('description', 'Test description');
  I.click('Create Task');
});

When('I try to create a task', () => {
  I.fillField('title', 'Test Task');
  I.fillField('description', 'Test Description');
  I.selectOption('status', 'In Progress');
  I.click('Create Task');
});

When('I submit a form that causes a server error', () => {
  I.fillField('title', 'Test Task');
  I.fillField('description', 'Test Description');
  I.selectOption('status', 'In Progress');
  I.click('Create Task');
});

// Error verification steps
Then('I should see an error message about service unavailability', () => {
  I.waitForText('Unable to connect', 10);
});

Then('the page should not crash', () => {
  I.dontSee('500 Internal Server Error');
  I.dontSee('Application Error');
  I.seeElement('body'); // Page renders something
});

Then('I should see a task not found error', () => {
  I.waitForText('Something went wrong', 5);
});

Then('I should see validation errors', () => {
  I.waitForText('Title is required', 5);
});

Then('I should see a 404 error page', () => {
  I.waitForText('Cannot GET', 5);
});

Then('I should be able to navigate back to home', () => {
  I.amOnPage('/');
  I.see('Task Management System');
});

Then('the form data should be preserved', () => {
  I.seeInField('title', 'Test Task');
  I.seeInField('description', 'Test Description');
});

Then('I should be able to retry', () => {
  I.see('Create Task');
});

Then('I should see an error message', () => {
  I.waitForText('There is a problem', 5);
});