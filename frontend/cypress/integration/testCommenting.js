//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testCommenting', () => {

    it('user can make comment and like comment on post', () => {

        //check to see if user can make a comment, and can like/dislike their comment and 
        //if the correct comment number and comment like number are reflected

        cy.visit('http://localhost:3000/home');

        //create post
        expect(cy.findByTestId('AddCircleOutlineIcon')).to.exist;
        cy.findByTestId('AddCircleOutlineIcon').click();
            
            const postTitle = 'postTestComment title';
            const postDescription = 'postTestComment description'
            const postContent = 'postTestComment content'
            const postTags = 'postcomment, postcomment, postcomment'
            cy.findByPlaceholderText(/title!/i).type(postTitle);
            cy.findByPlaceholderText(/describe it a little/i).type(postDescription);
            cy.findByPlaceholderText(/what's in your mind?/i).type(postContent);
            cy.findByPlaceholderText(/add tags!/i).type(postTags);

            cy.findByRole('button', { name: /share/i}).click();

            //find post on the page
            expect(cy.findByText(postTitle)).to.exist;

            //create and like and dislike comment and check if it is successful and if the numbers are alright
            cy.findByTestId('CommentIcon').click();
            cy.findByRole('button', {  name: /post/i}).should('be.disabled'); //checks if button is disabled
            cy.findByRole('textbox').type('post test comment 1');
            cy.findByRole('button', {  name: /post/i}).should('be.enabled');
            cy.findByRole('button', {  name: /post/i}).click();
            expect(cy.findByText(/post test comment 1/i)).to.exist;
            cy.findByTestId('likeCommentCount').contains("0");
            cy.findByTestId('FavoriteIcon').click();
            cy.findByTestId('likeCommentCount').contains("1");
            cy.findByTestId('FavoriteIcon').click();
            cy.findByTestId('likeCommentCount').contains("0");
            cy.findByRole('button', {  name: /close/i}).click();
            cy.findByTestId('CommentIcon').click();
            cy.findByTestId('likeCommentCount').contains("0");
            cy.findByTestId('FavoriteIcon').click();
            cy.findByTestId('likeCommentCount').contains("1");
            cy.findByRole('button', {  name: /close/i}).click();
            cy.reload();
            cy.findByTestId('commentCount').contains("1");
            cy.findByTestId('CommentIcon').click();
            cy.findByTestId('likeCommentCount').contains("1");
            cy.findByRole('button', {  name: /close/i}).click();
            
            





            

           

    
    })
})