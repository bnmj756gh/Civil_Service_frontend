const { I } = inject();

// Error scenario steps
When('I submit the form with invalid data', () => {
  I.fillField('title', ''); // Empty title
  I.fillField('description', 'A'.repeat(1000)); // Very long description
  I.click('Create Task');
});

When('I try to create a task', () => {
  I.fillField('title', 'Test Task');
  I.fillField('description', 'Test Description');
  I.selectOption('status', 'IN_PROGRESS');
  I.click('Create Task');
});

When('I submit a form that causes a server error', () => {
  I.fillField('title', 'Test Task');
  I.fillField('description', 'Test Description');
  I.selectOption('status', 'IN_PROGRESS');
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
  I.waitForText('Task not found', 5);
});

Then('I should see validation errors', () => {
  I.waitForText('required', 5);
});

Then('I should see a 404 error page', () => {
  I.waitForText('404', 5);
});

Then('I should be able to navigate back to home', () => {
  I.click('Home');
  I.seeInCurrentUrl('/');
});

Then('the form data should be preserved', () => {
  I.seeInField('title', 'Test Task');
  I.seeInField('description', 'Test Description');
});

Then('I should be able to retry', () => {
  I.seeElement('Create Task');
  I.click('Create Task');
});
