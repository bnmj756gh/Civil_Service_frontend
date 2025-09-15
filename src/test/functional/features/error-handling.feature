Feature: Error Handling
  As a user
  I want the application to handle errors gracefully
  So that I have a good user experience even when things go wrong

  Scenario: Handle task not found error
    When I go to '/tasks/999999'
    Then I should see a task not found error
    And the page should include 'Something went wrong'

  Scenario: Handle invalid task creation
    Given I am on the create task page
    When I submit the form with invalid data
    Then I should see validation errors
    And I should remain on the create task page

  Scenario: Navigate to non-existent page
    When I go to '/non-existent-page'
    Then I should see a 404 error page
    And I should be able to navigate back to home

  Scenario: Handle form submission errors
    Given I am on the create task page
    When I submit a form that causes a server error
    Then I should see an error message
    And the form data should be preserved
    And I should be able to retry
