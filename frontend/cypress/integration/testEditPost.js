//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testEditPost', () => {

    it('user can edit a public post', () => {

        //check to see if user can edit a public post

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
         cy.findByRole('button', {  name: /create a new post/i}).should('be.visible');
         cy.findByRole('button', {  name: /create a new post/i}).click();
             
             const postTitle = 'postTestComment title';
             const postDescription = 'postTestComment description'
             const postContent = 'postTestComment content'
             const postTags = 'postcomment, postcomment, postcomment'
             cy.findByPlaceholderText(/give it a title!/i).type(postTitle);
             cy.findByPlaceholderText(/what is this post about?/i).type(postDescription);
             cy.findByPlaceholderText(/what's in your mind?/i).type(postContent);
             cy.findByPlaceholderText(/add tags!/i).type(postTags);
             cy.findByText(/private/i).click();
 
             cy.findByRole('button', { name: "Post"}).click();
             //cy.findByRole('button', { name: /close/i}).click();
             cy.wait(1000);
             cy.reload();
 
             //find post on the page
             cy.findByText(postTitle).scrollIntoView().should('be.visible')

            
            cy.findByTestId('EditIcon').click();
            cy.get('input[name="postTitle"]').clear();     
            cy.get('input[name="postTitle"]').type("editedTitle");  
            cy.get('input[name="postDescription"]').clear();
            cy.get('input[name="postDescription"]').type("editedDescription");
            cy.get('textarea[name="postContent"]').clear();    
            cy.get('textarea[name="postContent"]').type("editedContent"); 
            cy.get('input[name="postTags"]').clear();   
            cy.get('input[name="postTags"]').type("editedTags");
            cy.findByRole('button', {  name: /update/i}).click()
            cy.findByTestId('CloseIcon').click();
            cy.reload();
            cy.wait(2000);

            cy.findByText("editedTitle").scrollIntoView().should('be.visible')
            cy.findByText("editedDescription").scrollIntoView().should('be.visible')
            cy.findByText("editedContent").scrollIntoView().should('be.visible')
            cy.findByText("#editedTags").scrollIntoView().should('be.visible')





    
    });
})