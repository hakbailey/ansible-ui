import { randomString } from '../../../../framework/utils/random-string';
import { Inventory } from '../../../../frontend/awx/interfaces/Inventory';
import { InventorySource } from '../../../../frontend/awx/interfaces/InventorySource';
import { JobTemplate } from '../../../../frontend/awx/interfaces/JobTemplate';
import { Organization } from '../../../../frontend/awx/interfaces/Organization';
import { Project } from '../../../../frontend/awx/interfaces/Project';
import { WorkflowJobTemplate } from '../../../../frontend/awx/interfaces/WorkflowJobTemplate';
import { WorkflowNode } from '../../../../frontend/awx/interfaces/WorkflowNode';

describe('Workflow Job templates visualizer', () => {
  let organization: Organization;
  let project: Project;
  let inventory: Inventory;
  let inventorySource: InventorySource;
  let jobTemplate: JobTemplate;
  let workflowJobTemplate: WorkflowJobTemplate;

  before(function () {
    organization = this.globalOrganization as Organization;
    project = this.globalProject as Project;
    cy.awxLogin();

    cy.createAwxInventory({ organization: organization.id })
      .then((i) => {
        inventory = i;
      })
      .then(() => {
        cy.createAwxInventorySource(inventory, project).then((invSrc) => {
          inventorySource = invSrc;
        });
        cy.createAwxJobTemplate({
          organization: organization.id,
          project: project.id,
          inventory: inventory.id,
        }).then((jt) => (jobTemplate = jt));
      });
  });
  beforeEach(function () {
    cy.createAwxWorkflowJobTemplate({
      organization: organization.id,
      inventory: inventory.id,
    }).then((wfjt) => (workflowJobTemplate = wfjt));
  });
  afterEach(() => {
    cy.deleteAwxWorkflowJobTemplate(workflowJobTemplate, { failOnStatusCode: false });
  });
  after(function () {
    cy.deleteAwxInventory(inventory, { failOnStatusCode: false });
    cy.deleteAwxInventorySource(inventorySource, { failOnStatusCode: false });
    cy.deleteAwxJobTemplate(jobTemplate, { failOnStatusCode: false });
  });

  it('should render a workflow visualizer view with multiple nodes present', () => {
    cy.renderWorkflowVisualizerNodesFromFixtureFile(
      `${workflowJobTemplate.name}`,
      'wf_vis_testing_A.json'
    );
    cy.get('[class*="66-node-label"]').should('exist').should('contain', 'Cleanup Activity Stream');
    cy.get('[class*="43-node-label"]').should('exist').should('contain', 'bar');
    cy.get('[class*="42-node-label"]').should('exist').should('contain', '1');
    cy.get('[class*="41-node-label"]').should('exist').should('contain', 'Demo Project');
    cy.deleteAwxWorkflowJobTemplate(workflowJobTemplate);
  });

  it('Should create a workflow job template and then navigate to the visualizer, and then navigate to the details view after clicking cancel', () => {
    const jtName = 'E2E ' + randomString(4);
    // Create workflow job template
    cy.navigateTo('awx', 'templates');
    cy.clickButton(/^Create template$/);
    cy.clickLink(/^Create workflow job template$/);
    cy.get('[data-cy="name"]').type(jtName);
    cy.get('[data-cy="description"]').type('this is a description');
    cy.get('[data-cy="Submit"]').click();

    cy.get('[data-cy="workflow-visualizer"]').should('be.visible');
    cy.get('h4.pf-v5-c-empty-state__title-text').should(
      'have.text',
      'There are currently no nodes in this workflow'
    );
    cy.get('div.pf-v5-c-empty-state__actions').within(() => {
      cy.get('[data-cy="add-node-button"]').should('be.visible');
    });

    cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
    cy.verifyPageTitle(`${jtName}`);
  });
  it('Click on edge context menu option to change link type and close visualizer to show unsaved changes modal', function () {
    let projectNode: WorkflowNode;
    let approvalNode: WorkflowNode;
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project)
      .then((projNode) => {
        projectNode = projNode;
        cy.createAwxWorkflowVisualizerApprovalNode(workflowJobTemplate).then((appNode) => {
          approvalNode = appNode;
          cy.createWorkflowJTSuccessNodeLink(projectNode, appNode);
        });
      })
      .then(() => {
        cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.get(`g[data-id="${projectNode.id}-${approvalNode.id}"]`).should(
          'have.text',
          'Run on success'
        );
        cy.get(`g[data-id="${projectNode.id}-${approvalNode.id}"]`).within(() => {
          cy.get('[data-cy="edge-context-menu_kebab"]').click({ force: true });
        });
        cy.get('li[data-cy="fail"]').click();
        cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
        cy.get('div[data-cy="visualizer-unsaved-changes-modal"]').should('be.visible');
        cy.get('button[data-cy="exit-without-saving"]').click();
        cy.verifyPageTitle(`${workflowJobTemplate.name}`);
      });
  });
  it('Adds a new node linked to an existing node with always status, and save the visualizer.', function () {
    let projectNode: WorkflowNode;
    let approvalNode: WorkflowNode;
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project)
      .then((projNode) => {
        projectNode = projNode;
        cy.createAwxWorkflowVisualizerApprovalNode(workflowJobTemplate).then((appNode) => {
          approvalNode = appNode;
          cy.createWorkflowJTSuccessNodeLink(projectNode, appNode);
        });
      })
      .then(() => {
        cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.get(`g[data-id=${approvalNode.id}] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="add-node-and-link"]').click();

        cy.selectDropdownOptionByResourceName('node-type', 'Job Template');
        cy.selectDropdownOptionByResourceName('job-template-select', `${jobTemplate.name}`);
        cy.selectDropdownOptionByResourceName('node-status-type', 'Always');
        cy.selectDropdownOptionByResourceName('node-convergence', 'All');
        cy.get('[data-cy="node-alias"]').type('Test Node');
        cy.clickButton('Next');
        cy.clickButton('Finish');
        cy.get('g[data-id="3-unsavedNode"]').should('have.text', 'Test Node');
        cy.get(`g[data-id=${approvalNode.id}-3-unsavedNode]`).should('have.text', 'Run always');
        cy.clickButton('Save');
        cy.get('[data-cy="alert-toaster"]').should('be.visible');
        cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
        cy.verifyPageTitle(`${workflowJobTemplate.name}`);
      });
  });
  it('Remove all steps using the kebab menu of the visualizer toolbar, save and delete the template', function () {
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project).then((projectNode) => {
      cy.createAwxWorkflowVisualizerInventorySourceNode(workflowJobTemplate, inventorySource).then(
        (inventorySourceNode) => {
          cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1).then(
            (managementNode) => {
              cy.createWorkflowJTSuccessNodeLink(projectNode, inventorySourceNode);
              cy.createWorkflowJTAlwaysNodeLink(inventorySourceNode, managementNode);
            }
          );
        }
      );
      cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
      cy.get('[data-cy="wf-vzr-name"]')
        .should('contain', `${workflowJobTemplate.name}`)
        .should('be.visible');
      cy.removeAllNodesFromVisualizerToolbar();
      cy.contains('button', 'Save').click();
      cy.get('[data-kind="node"]').should('have.length', 0);
      cy.deleteAwxWorkflowJobTemplate(workflowJobTemplate);
    });
  });
  it('Can edit a node resource on a workflow visualizer already containing existing nodes', function () {
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project).then((projectNode) => {
      cy.createAwxWorkflowVisualizerInventorySourceNode(workflowJobTemplate, inventorySource).then(
        (inventorySourceNode) => {
          cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1)
            .then((managementNode) => {
              cy.createWorkflowJTSuccessNodeLink(projectNode, inventorySourceNode);
              cy.createWorkflowJTAlwaysNodeLink(inventorySourceNode, managementNode);
            })
            .then(() => {
              cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
              cy.get(`g[data-id=${projectNode.id}] .pf-topology__node__action-icon`).click({
                force: true,
              });
              cy.get('li[data-cy="edit-node"]').click();
              cy.get('[data-cy*="node-type-form-group"]').should(
                'have.text',
                'Node type * Project Sync'
              );
              cy.selectDropdownOptionByResourceName('node-type', 'Inventory Source Sync');
              cy.selectDropdownOptionByResourceName(
                'inventory-source-select',
                `${inventorySource.name}`
              );
              cy.selectDropdownOptionByResourceName('node-convergence', 'All');
              cy.get('[data-cy="node-alias"]').type('Inventory Source Node');
              cy.clickButton('Next');
              cy.clickButton('Finish');
              cy.get(`g[data-id=${projectNode.id}]`).should('have.text', 'Inventory Source Node');
            });
        }
      );
      cy.clickButton('Save');
      cy.get('[data-cy="alert-toaster"]').should(
        'have.text',
        'Success alert:Successfully saved workflow visualizer'
      );

      cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
      cy.get('[data-cy="page-title"]').should('have.text', `${workflowJobTemplate.name}`);
    });
  });
  it('Create a job template node using a JT with multiple dependencies and then edit the node to use a different resource', function () {
    cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
    cy.contains('Workflow Visualizer').should('be.visible');
    cy.clickButton('Add step');

    cy.selectDropdownOptionByResourceName('node-type', 'Job Template');
    cy.selectDropdownOptionByResourceName('job-template-select', `${jobTemplate.name}`);
    cy.selectDropdownOptionByResourceName('node-convergence', 'All');
    cy.get('[data-cy="node-alias"]').type('Test Node');
    cy.clickButton('Next');
    cy.clickButton('Finish');
    cy.get('g[data-id="1-unsavedNode"]').should('have.text', 'Test Node');
    cy.get(`g[data-id="1-unsavedNode"] .pf-topology__node__action-icon`).click({
      force: true,
    });
    cy.get('li[data-cy="edit-node"]').click();
    cy.selectDropdownOptionByResourceName('node-type', 'Project Sync');
    cy.selectDropdownOptionByResourceName('project', `${project.name}`);
    cy.selectDropdownOptionByResourceName('node-convergence', 'All');
    cy.get('[data-cy="node-alias"]').type(`Project Node`);
    cy.clickButton('Next');
    cy.clickButton('Finish');
    cy.get('g[data-id="1-unsavedNode"]').should('have.text', 'Test NodeProject Node');
    cy.clickButton('Save');
    cy.get('[data-cy="alert-toaster"]').should('be.visible');
    cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();

    cy.get('[data-cy="page-title"]').should('have.text', `${workflowJobTemplate.name}`);
  });
  it('Adds a new node specifically linked to an already existing node.', function () {
    let projectNode: WorkflowNode;
    let approvalNode: WorkflowNode;
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project)
      .then((projNode) => {
        projectNode = projNode;
        cy.createAwxWorkflowVisualizerApprovalNode(workflowJobTemplate).then((appNode) => {
          approvalNode = appNode;
          cy.createWorkflowJTSuccessNodeLink(projectNode, appNode);
        });
      })
      .then(() => {
        cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.get(`g[data-id=${approvalNode.id}] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="add-node-and-link"]').click();

        cy.selectDropdownOptionByResourceName('node-type', 'Job Template');
        cy.selectDropdownOptionByResourceName('job-template-select', `${jobTemplate.name}`);
        cy.selectDropdownOptionByResourceName('node-status-type', 'Always');
        cy.selectDropdownOptionByResourceName('node-convergence', 'All');
        cy.get('[data-cy="node-alias"]').type('Test Node');
        cy.clickButton('Next');
        cy.clickButton('Finish');
        cy.get('g[data-id="3-unsavedNode"]').should('have.text', 'Test Node');
        cy.get(`g[data-id=${approvalNode.id}-3-unsavedNode]`).should('have.text', 'Run always');
        cy.clickButton('Save');
        cy.get('[data-cy="alert-toaster"]').should(
          'have.text',
          'Success alert:Successfully saved workflow visualizer'
        );
        cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
        cy.get('[data-cy="page-title"]').should('have.text', `${workflowJobTemplate.name}`);
      });
  });
  it.skip('Can manually delete all nodes, save the visualizer, then add new nodes, and successfully save again.', function () {
    let projectNode: WorkflowNode;
    let approvalNode: WorkflowNode;
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project)
      .then((projNode) => {
        projectNode = projNode;
        cy.createAwxWorkflowVisualizerApprovalNode(workflowJobTemplate).then((appNode) => {
          approvalNode = appNode;
          cy.createWorkflowJTSuccessNodeLink(projectNode, appNode);
        });
      })
      .then(() => {
        cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.get(`g[data-id=${projectNode.id}] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="remove-node"]').click();
        cy.clickModalConfirmCheckbox();
        cy.clickModalButton('Remove');
        cy.clickModalButton('Close');

        cy.get(`g[data-id=${approvalNode.id}] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="remove-node"]').click();
        cy.clickModalConfirmCheckbox();
        cy.clickModalButton('Remove');
        cy.clickModalButton('Close');
        cy.clickButton('Save');
        cy.get('[data-cy="alert-toaster"]').should('be.visible');
        cy.clickButton('Add step');
        cy.selectDropdownOptionByResourceName('node-type', 'Job Template');
        cy.selectDropdownOptionByResourceName('job-template-select', `${jobTemplate.name}`);
        cy.selectDropdownOptionByResourceName('node-convergence', 'All');
        cy.get('[data-cy="node-alias"]').type('Test Node');
        cy.clickButton('Next');
        cy.clickButton('Finish');
        cy.get(`g[data-id="3-unsavedNode"] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="add-node-and-link"]').click();

        cy.selectDropdownOptionByResourceName('node-type', 'Project Sync');
        cy.selectDropdownOptionByResourceName('project', `${project.name}`);
        cy.selectDropdownOptionByResourceName('node-convergence', 'All');
        cy.get('[data-cy="node-alias"]').type('Project Node');
        cy.clickButton('Next');
        cy.clickButton('Finish');
        cy.clickButton('Save');
        cy.get('[data-cy="alert-toaster"]').should(
          'have.text',
          'Success alert:Successfully saved workflow visualizer'
        );

        cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();

        cy.get('[data-cy="page-title"]').should('have.text', `${workflowJobTemplate.name}`);
      });
  });
  it('Can delete one single node and save the visualizer', function () {
    let projectNode: WorkflowNode;
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project).then((projNode) => {
      projectNode = projNode;
      cy.createAwxWorkflowVisualizerApprovalNode(workflowJobTemplate).then(() => {
        cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.get(`g[data-id=${projectNode.id}] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="add-node-and-link"]').click();

        cy.selectDropdownOptionByResourceName('node-type', 'Job Template');
        cy.selectDropdownOptionByResourceName('job-template-select', `${jobTemplate.name}`);
        cy.selectDropdownOptionByResourceName('node-status-type', 'Always');
        cy.selectDropdownOptionByResourceName('node-convergence', 'All');
        cy.get('[data-cy="node-alias"]').type('Test Node');
        cy.clickButton('Next');
        cy.clickButton('Finish');
        cy.get('g[data-id="3-unsavedNode"]').should('have.text', 'Test Node');
        cy.get(`g[data-id=${projectNode.id}-3-unsavedNode]`).should('have.text', 'Run always');
        cy.get(`g[data-id=${projectNode.id}] .pf-topology__node__action-icon`).click({
          force: true,
        });
        cy.get('li[data-cy="remove-node"]').click();
        cy.clickModalConfirmCheckbox();
        cy.clickModalButton('Remove');
        cy.clickModalButton('Close');
        cy.clickButton('Save');
        cy.get('[data-cy="alert-toaster"]').should(
          'have.text',
          'Success alert:Successfully saved workflow visualizer'
        );
        cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
        cy.get('[data-cy="page-title"]').should('have.text', `${workflowJobTemplate.name}`);
      });
    });
  });
  it.skip('Can remove all existing nodes on a visualizer using the button in the toolbar kebab, save the visualizer, then add 2 new nodes and save the visualizer again', function () {
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project).then((projectNode) => {
      cy.createAwxWorkflowVisualizerInventorySourceNode(workflowJobTemplate, inventorySource).then(
        (inventorySourceNode) => {
          cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1)
            .then((managementNode) => {
              cy.createWorkflowJTSuccessNodeLink(projectNode, inventorySourceNode);
              cy.createWorkflowJTAlwaysNodeLink(inventorySourceNode, managementNode);
            })
            .then(() => {
              cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);

              cy.get('[data-cy="wf-vzr-name"]')
                .should('contain', `${workflowJobTemplate.name}`)
                .should('be.visible');
              cy.removeAllNodesFromVisualizerToolbar();
              cy.contains('button', 'Save').click();
              cy.clickButton('Add step');
              cy.selectDropdownOptionByResourceName('node-type', 'Job Template');
              cy.selectDropdownOptionByResourceName('job-template-select', `${jobTemplate.name}`);
              cy.selectDropdownOptionByResourceName('node-convergence', 'All');
              cy.get('[data-cy="node-alias"]').type('Test Node');
              cy.clickButton('Next');
              cy.clickButton('Finish');
              cy.clickButton('Add step');
              cy.selectDropdownOptionByResourceName('node-type', 'Project Sync');
              cy.selectDropdownOptionByResourceName('project', `${project.name}`);
              cy.selectDropdownOptionByResourceName('node-convergence', 'All');
              cy.clickButton('Next');
              cy.clickButton('Finish');
              cy.get('g[data-kind="node"]').should('have.length', 3);
              cy.clickButton('Save');
              cy.get('[data-cy="alert-toaster"]').should(
                'have.text',
                'Success alert:Successfully saved workflow visualizer'
              );
              cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();
              cy.get('[data-cy="page-title"]').should('have.text', `${workflowJobTemplate.name}`);
            });
        }
      );
    });
  });
  it.skip('Should launch a workflow job template from the visualizer, and navigate to the output page.', function () {
    let projectNode: WorkflowNode;
    cy.createAwxWorkflowVisualizerProjectNode(workflowJobTemplate, project)
      .then((projNode) => {
        projectNode = projNode;
        cy.createAwxWorkflowVisualizerApprovalNode(workflowJobTemplate).then((appNode) => {
          cy.createWorkflowJTSuccessNodeLink(projectNode, appNode);
        });
      })
      .then(() => {
        cy.visit(`/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`);
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.get('[data-cy="workflow-visualizer-toolbar-kebab"]').click();
        cy.intercept('POST', `api/v2/workflow_job_templates/${workflowJobTemplate.id}/launch/`).as(
          'launchWJT-WithNodes'
        );
        cy.clickButton('Launch');
        cy.wait('@launchWJT-WithNodes')
          .its('response.body.id')
          .then((jobId: string) => {
            cy.url().should('contain', `/jobs/workflow/${jobId}/output`);
          });
      });
  });
});
