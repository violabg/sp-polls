# Feature: UI Event Management and Mock Login

## Feature Overview

This feature enhances the user interface by replacing applicable HTML divs with Shadcn components, adds pages for creating and editing events using Shadcn field components, and implements mock login functionality for admin and user roles.

## User Scenarios & Testing

### Scenario 1: Admin Mock Login

Given an admin user

When they click the "Login as Admin" button

Then they are redirected to /events

### Scenario 2: User Mock Login

Given a user

When they click the "Login as User" button

Then they are redirected to /e/event-001 (using the mock event)

### Scenario 3: Create New Event

Given an admin user on /events

When they navigate to /events/new

Then they see a form to create a new event using Shadcn field components

### Scenario 4: Edit Event

Given an admin user on /events

When they navigate to /events/{id}/edit

Then they see a form to edit the event using Shadcn field components

### Scenario 5: UI Components Replacement

Given the application

When components are rendered

Then HTML divs are replaced with Shadcn components where applicable (buttons, cards, radios)

## Functional Requirements

1. The login form shall include two mock login buttons: one for admin role redirecting to /events, one for user role redirecting to /e/event-001

2. A new page at /events/new shall be created using Shadcn field components for event creation

3. A new page at /events/{id}/edit shall be created using Shadcn field components for event editing

4. Applicable HTML divs shall be replaced with Shadcn components (Button, Card, RadioGroup, etc.)

## Success Criteria

1. Mock login buttons navigate to correct pages

2. Event creation and edit pages load and display forms using Shadcn field components

3. UI components are consistently using Shadcn where applicable

4. No broken functionality from component replacements

## Key Entities

- Event: has id, title, description, qr_code_url, created_by, created_at, status

- User: has role (admin or user)

## Assumptions

- Shadcn components are installed and available

- Next.js routing is used for navigation

- A mock event with id 'event-001' exists for user mock login

- Event data structure is defined in types.ts

## Dependencies

- Shadcn UI library

- Next.js

- Existing event types and mock data
