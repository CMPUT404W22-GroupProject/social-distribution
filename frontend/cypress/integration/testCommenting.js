//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testCommenting', () => {

    it('user can make comment and like comment on post', () => {

        //check to see if user can make a comment, and can like/dislike their comment and 
        //if the correct comment number and comment like number are reflected
        
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
            //expect(cy.findByText(postTitle)).scrollIntoView().to.exist;

            //create and like and dislike comment and check if it is successful and if the numbers are alright
            cy.findByTestId('CommentIcon').click();
            cy.findByTestId('commentSectionTextbox').type('post test comment 1');
            cy.findByRole('button', { name: "Post"}).should('be.enabled');
            cy.findByRole('button', { name: "Post"}).click();
            expect(cy.findByText(/post test comment 1/i)).to.exist;
            cy.findByTestId('likeCommentCount').contains("0");
            cy.findByTestId('FavoriteBorderIconComment').click();
            cy.findByTestId('likeCommentCount').contains("1");
            cy.findByTestId('FavoriteIconComment').click();
            cy.findByTestId('likeCommentCount').contains("0");
            cy.findByTestId('CloseIcon').click();
            cy.findByTestId('CommentIcon').click();
            cy.findByTestId('likeCommentCount').contains("0");
            cy.findByTestId('FavoriteBorderIconComment').click();
            cy.findByTestId('likeCommentCount').contains("1");
            cy.findByTestId('CloseIcon').click();
            cy.reload();
            cy.findByTestId('commentCount').contains("1");
            cy.findByTestId('CommentIcon').click();
            cy.findByTestId('likeCommentCount').contains("1");
            cy.findByTestId('CloseIcon').click();
            
            
 




            

           

    
    })
})