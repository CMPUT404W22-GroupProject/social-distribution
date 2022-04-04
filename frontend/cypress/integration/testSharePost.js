//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testSharePost', () => {

    it('user can share a post', () => {

        //check to see if user can share a post

        cy.visit('http://localhost:3000/login'); //login as testUser

        expect(cy.findByRole('heading', {  name: /login/i})).to.exist;
 
        cy.findByPlaceholderText(/example@gmail.com/i).type('testUser@example.com')
        cy.findByPlaceholderText(/password/i).type('testUser')
        cy.findByRole('button', {  name: /log in/i}).click();
        cy.wait(1000)
 
        cy.findByText('Profile').scrollIntoView().should('be.visible');
        cy.findByText('Profile').scrollIntoView().click();
        cy.wait(2000);
        cy.findByRole('heading', {  name: /testuser/i}).should('be.visible'); //logged in as testUser

        //create post
        expect(cy.findByTestId('AddCircleOutlineIcon')).to.exist;
        cy.findByTestId('AddCircleOutlineIcon').click();
            
            const postTitle = 'post 1 title';
            const postDescription = 'post 1 description'
            const postContent = 'post 1 content'
            const postTags = 'post1, post1, post1'
            cy.findByPlaceholderText(/title!/i).type(postTitle);
            cy.findByPlaceholderText(/describe it a little/i).type(postDescription);
            cy.findByPlaceholderText(/what's in your mind?/i).type(postContent);
            cy.findByPlaceholderText(/add tags!/i).type(postTags);
            cy.findByText(/public\?/i).click();

            cy.findByRole('button', {  name: /share/i}).click();
            cy.findByRole('button', { name: /close/i}).click();

            //find post on the page
            cy.findByText(postTitle).scrollIntoView().should('be.visible')

            
            cy.findByTestId('ShareIcon').click();
            cy.wait(1000);
            cy.findByRole('button', {  name: /share/i}).click();
            cy.wait(1000);
            cy.findByRole('button', {  name: /close/i}).click();
            cy.reload();
            cy.wait(1000);
            cy.findByText("testUser shared testUser's post: " + postTitle).scrollIntoView().should('be.visible')


            
    
    });
})