Feature: Task Management
  As a user
  I want to manage tasks
  So that I can track my work

  Background:
    Given the application is running

  Scenario: View task summary page
    When I go to '/'
    Then the page should include 'Task Management System'
    And I should see the task summary page

  Scenario: Navigate to create task form
    When I go to '/'
    And I click on create new task
    Then I should be on the create task page
    And the page should include 'Create New Task'

  Scenario: Create a new task successfully
    Given I am on the create task page
    When I fill in the task form with valid data
    And I submit the task form
    Then I should be redirected to the task summary
    And I should see a success message

  Scenario: Create task with missing title
    Given I am on the create task page
    When I fill in the task form without a title
    And I submit the task form
    Then I should see a validation error
    And I should remain on the create task page

  Scenario: View task details
    Given there are existing tasks
    When I go to '/'
    And I click on a task
    Then I should see the task details page
    And the page should include the task information

  Scenario: Update task status
    Given I am viewing a task in IN_PROGRESS status
    When I change the status to COMPLETED
    And I submit the status change
    Then I should see an update success message
    And the task status should be updated

  Scenario: Delete a task
    Given I am viewing a task
    When I click the delete button
    And I confirm the deletion
    Then I should be redirected to the task summary
    And I should see a deletion success message
