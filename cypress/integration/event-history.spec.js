/// <reference types="cypress" />

import { formatDistanceToNow } from 'date-fns';
import * as dateTz from 'date-fns-tz';

import workflowCompletedFixture from '../fixtures/workflow-completed.json';
import eventsFixture from '../fixtures/event-history-completed.json';

const { workflowId, runId } =
  workflowCompletedFixture.workflowExecutionInfo.execution;

describe('Workflow Events', () => {
  beforeEach(() => {
    cy.interceptApi();

    cy.intercept(
      Cypress.env('VITE_API_HOST') +
        `/api/v1/namespaces/default/workflows/*/runs/*/events/reverse*`,
      { fixture: 'event-history-completed.json' },
    ).as('event-history-api');

    cy.intercept(
      Cypress.env('VITE_API_HOST') +
        `/api/v1/namespaces/default/workflows/${workflowId}/runs/${runId}?`,
      { fixture: 'workflow-completed.json' },
    ).as('workflow-api');

    cy.visit('/namespaces/default/workflows');

    cy.wait('@workflows-api');
    cy.wait('@namespaces-api');
  });

  it('default to the summary page when visiting a workflow', () => {
    cy.clearLocalStorage();

    cy.visit(`/namespaces/default/workflows/${workflowId}/${runId}`);

    cy.wait('@workflow-api');
    cy.wait('@event-history-api');

    cy.url().should('contain', '/feed');
  });

  it('default to last viewed event view when visiting a workflow', () => {
    cy.visit(`/namespaces/default/workflows/${workflowId}/${runId}`);

    cy.wait('@workflow-api');
    cy.wait('@event-history-api');

    cy.url().should('contain', '/feed');

    cy.get('[data-cy="feed"]').click();
    cy.url().should('contain', '/feed');

    cy.visit('/namespaces/default/workflows');

    cy.visit(`/namespaces/default/workflows/${workflowId}/${runId}`);
    cy.url().should('contain', '/feed');
  });

  it('should render events in feed view', () => {
    cy.visit(
      `/namespaces/default/workflows/${workflowId}/${runId}/history/feed`,
    );

    cy.wait('@workflow-api');
    cy.wait('@event-history-api');

    cy.get('[data-cy="event-summary-row"]').should(
      'have.length',
      eventsFixture.history.events.length,
    );

    const eventType = eventsFixture.history.events[0].eventType;
    cy.get('[data-cy="event-summary-table"]').contains(eventType);
  });

  it('should render event time in various formats', () => {
    cy.visit(
      `/namespaces/default/workflows/${workflowId}/${runId}/history/feed`,
    );

    cy.wait('@workflow-api');
    cy.wait('@event-history-api');

    const dt = new Date(eventsFixture.history.events[0].eventTime);

    cy.get(
      '[data-cy="event-summary-table-header-desktop"] [data-cy=event-date-filter-button]',
    ).click();
    cy.get(
      '[data-cy="event-summary-table-header-desktop"] [data-cy=event-date-filter-relative]',
    ).click();
    const relative = formatDistanceToNow(dt);
    cy.get('[data-cy="event-summary-table"]').contains(relative);

    cy.get(
      '[data-cy="event-summary-table-header-desktop"] [data-cy=event-date-filter-button]',
    ).click();
    cy.get(
      '[data-cy="event-summary-table-header-desktop"] [data-cy=event-date-filter-UTC]',
    ).click();
    const utc = dateTz.formatInTimeZone(dt, 'UTC', 'yyyy-MM-dd z HH:mm:ss.SS');
    cy.get('[data-cy="event-summary-table"]').contains(utc);

    cy.get(
      '[data-cy="event-summary-table-header-desktop"] [data-cy=event-date-filter-button]',
    ).click();
    cy.get(
      '[data-cy="event-summary-table-header-desktop"] [data-cy=event-date-filter-local]',
    ).click();
    const local = dateTz.format(dt, 'yyyy-MM-dd z HH:mm:ss.SS');
    cy.get('[data-cy="event-summary-table"]').contains(local);
  });

  it('should render events in compact view', () => {
    cy.visit(
      `/namespaces/default/workflows/${workflowId}/${runId}/history/compact`,
    );

    cy.wait('@workflow-api');
    cy.wait('@event-history-api');

    cy.get('[data-cy="event-summary-row"]')
      .should('not.have.length', 0)
      .should('not.have.length', eventsFixture.history.events.length);
    cy.get('[data-cy="event-summary-table"]').contains('CompletedActivity');
  });

  it('should be viewable as JSON', () => {
    cy.visit(`/namespaces/default/workflows/${workflowId}/${runId}`);

    cy.wait('@workflow-api');
    cy.wait('@event-history-api');

    cy.get('[data-cy="json"]').click();

    const match = eventsFixture.history.events[0].eventTime;
    cy.get('[data-cy="event-history-json"]').contains(match);
  });
});
