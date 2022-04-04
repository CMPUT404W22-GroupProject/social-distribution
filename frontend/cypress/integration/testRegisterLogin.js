//PLEASE DELETE testUser FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testRegisterLogin', () => {

    it('user can create account and login', () => {

        //check to see if user can create account and login using the created account
        
       cy.visit('http://localhost:3000/register'); //creating test user (might fail because testUser already exists, make sure thats deleted)

       expect(cy.findByRole('heading', {  name: /register/i})).to.exist;

       cy.findByPlaceholderText(/display name/i).type('testUser')
       cy.findByPlaceholderText(/example@gmail.com/i).type('testUser@example.com')
       cy.findByPlaceholderText('password').type('testUser')
       cy.findByPlaceholderText(/confirm password/i).type('testUser')
       cy.findByRole('button', {  name: /register/i}).click();
       cy.wait(2000)
       
       cy.visit('http://localhost:3000/login')

       expect(cy.findByRole('heading', {  name: /login/i})).to.exist;
       cy.findByPlaceholderText(/example@gmail.com/i).type('testUser@example.com')
       cy.findByPlaceholderText(/password/i).type('testUser')
       cy.findByRole('button', {  name: /log in/i}).click();
       cy.wait(2000)

       cy.findByText('Profile').scrollIntoView().should('be.visible');
       cy.findByText('Profile').scrollIntoView().click();
       cy.wait(2000);
       cy.findByRole('heading', {  name: /testuser/i}).should('be.visible');
    })
})