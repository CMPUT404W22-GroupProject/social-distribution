//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testCommenting', () => {

    it('user can make comment and like comment on post', () => {

        //check to see if user can make a comment, and can like their comment and 
        //if the correct comment number and comment like number are reflected

        cy.visit('http://localhost:3000/home');

        //create post
        expect(cy.findByTestId('AddCircleOutlineIcon')).to.exist;
        cy.findByTestId('AddCircleOutlineIcon').click();
            
            const postTitle = 'postTestLike title';
            const postDescription = 'postTestLike description'
            const postContent = 'postTestLike content'
            const postTags = 'postLike, postLike, postLike'
            cy.findByPlaceholderText(/title!/i).type(postTitle);
            cy.findByPlaceholderText(/describe it a little/i).type(postDescription);
            cy.findByPlaceholderText(/what's in your mind?/i).type(postContent);
            cy.findByPlaceholderText(/add tags!/i).type(postTags);

            cy.findByRole('button', { name: /share/i}).click();

            //find post on the page
            expect(cy.findByText(postTitle)).to.exist;

            //create and like comment and check if it is successful and if the numbers are alright
            cy.findByTestId('likeCount').contains("0");
            cy.findByTestId('ThumbUpIcon').click();
            cy.findByTestId('likeCount').contains("1");
            cy.reload();
            cy.findByTestId('likeCount').contains("1");
            cy.reload();
            cy.findByTestId('likeCount').contains("1");
    
    });
})