//PLEASE DELETE testUser FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testLogin', () => {

    it('user can login', () => {

        //check to see if user can login using testUser account, make sure testUser account exists first
        
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