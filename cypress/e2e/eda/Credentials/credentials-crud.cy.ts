//Tests a user's ability to create, edit, and delete a Credential in the EDA UI.
//Do we want to add create tests for all credential types now or wait until next release cycle?

describe('EDA Credentials- Create, Edit, Delete', () => {
  before(() => {
    cy.edaLogin();
  });

  it.skip('can create a machine credential, and assert the information showing on the details page, and then delete it', () => {
    //write test here
  });

  it.skip('can create a source control credential, verify edit functionality, and then delete', () => {
    //write test here
  });
});