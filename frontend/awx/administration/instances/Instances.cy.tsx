import { awxAPI } from '../../../../cypress/support/formatApiPathForAwx';
import { Instances } from './Instances';

describe('Instances list', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/instances/*',
      },
      {
        fixture: 'instances.json',
      }
    );
  });

  it('Instances list renders with k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');

    cy.mount(<Instances />);
    cy.wait('@isK8s');

    cy.verifyPageTitle('Instances');
    cy.get('[data-cy="app-description"]').should(
      'contain',
      'Ansible node instances dedicated for a particular purpose indicated by node type.'
    );
    cy.get('[data-cy="add-instance"]').should('be.visible');
    cy.get('[data-cy="remove-instance"]').should('be.visible');
    cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'true');
    cy.get('tbody').find('tr').should('have.length', 10);
  });

  it('Instances list renders with non k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: false,
    }).as('isK8s');

    cy.mount(<Instances />);
    cy.wait('@isK8s');

    cy.verifyPageTitle('Instances');
    cy.get('[data-cy="app-description"]').should(
      'contain',
      'Ansible node instances dedicated for a particular purpose indicated by node type.'
    );
    cy.get('[data-cy="add-instance"]').should('not.exist');
    cy.get('[data-cy="remove-instance"]').should('be.visible');
    cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'true');
    cy.get('tbody').find('tr').should('have.length', 10);
  });

  it('Filter instances by name', () => {
    cy.mount(<Instances />);
    cy.intercept('/api/v2/instances/?not__node_type=control%2Chybrid&hostname__icontains=test*').as(
      'nameFilterRequest'
    );
    cy.filterTableByTypeAndText(/^Name$/, 'test');
    cy.wait('@nameFilterRequest');
    cy.clickButton(/^Clear all filters$/);
  });

  it('Filter instances by node', () => {
    cy.mount(<Instances />);
    cy.intercept('/api/v2/instances/?not__node_type=control%2Chybrid&node_type=control*').as(
      'controlFilterRequest'
    );
    cy.filterByMultiSelection('Node type', 'Control');
    cy.wait('@controlFilterRequest');
    cy.clickButton(/^Clear all filters$/);
  });

  it('remove instance button should be disable if instance with node type control is selected', () => {
    cy.intercept(
      { method: 'GET', url: awxAPI`/instances/*` },
      { fixture: 'instance_list_control.json' }
    ).as('getInstance');
    cy.mount(<Instances />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="checkbox-column-cell"]').first().click();
        cy.get('[data-cy="remove-instance"]').should('be.visible');
        cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'true');
      });
  });

  it('remove instance button should be enabled if instance with node type hop is selected', () => {
    cy.intercept(
      { method: 'GET', url: awxAPI`/instances/*` },
      { fixture: 'instance_list_hop.json' }
    ).as('getInstance');
    cy.mount(<Instances />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="checkbox-column-cell"]').first().click();
        cy.get('[data-cy="remove-instance"]').should('be.visible');
        cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'false');
      });
  });

  it('remove instance button should be enabled if instance with node type execution is selected', () => {
    cy.intercept(
      { method: 'GET', url: awxAPI`/instances/*` },
      { fixture: 'instance_execution.json' }
    ).as('getInstance');
    cy.mount(<Instances />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="checkbox-column-cell"]').first().click();
        cy.get('[data-cy="remove-instance"]').should('be.visible');
        cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'false');
      });
  });

  it('remove instance button should be disabled if instance with node type hybrid is selected', () => {
    cy.intercept(
      { method: 'GET', url: awxAPI`/instances/*` },
      { fixture: 'instance_list_hybrid.json' }
    ).as('getInstance');
    cy.mount(<Instances />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="checkbox-column-cell"]').first().click();
        cy.get('[data-cy="remove-instance"]').should('be.visible');
        cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'true');
      });
  });
});

describe('Instance Empty list', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/instances/*',
      },
      {
        fixture: 'emptyList.json',
      }
    ).as('emptyList');
  });

  it('Empty state is displayed correctly', () => {
    cy.mount(<Instances />);
    cy.get('[data-cy="empty-state-title"]').should('contain', 'No instances yet');
  });
});
