//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testCreatingPost', () => {

    it('user can make a post', () => {

        //see if no post message is shown 
	    //create post, 
	    //find post on the page, and find each of the elements
        
        cy.visit('http://localhost:3000/home');

        //see if no post message is shown 
        expect(cy.findByTestId('SentimentVeryDissatisfiedIcon')).to.exist;
        cy.findByText(/no new posts!/i).should('be.visible');

        //create post
        expect(cy.findByTestId('AddCircleOutlineIcon')).to.exist;
        cy.findByTestId('AddCircleOutlineIcon').click();

            //if text fields are available
            cy.findByPlaceholderText(/title!/i).should('be.visible');
            cy.findByPlaceholderText(/describe it a little/i).should('be.visible');
            cy.findByPlaceholderText(/what's in your mind?/i).should('be.visible');
            cy.findByPlaceholderText(/add tags!/i).should('be.visible');
            
            const postTitle = 'post 1 title';
            const postDescription = 'post 1 description'
            const postContent = 'post 1 content'
            const postTags = 'post1, post1, post1'
            cy.findByPlaceholderText(/title!/i).type(postTitle);
            cy.findByPlaceholderText(/describe it a little/i).type(postDescription);
            cy.findByPlaceholderText(/what's in your mind?/i).type(postContent);
            cy.findByPlaceholderText(/add tags!/i).type(postTags);

            cy.findByRole('button', {  name: /share/i}).click();

            //find post on the page, and find each of the elements
            
            expect(cy.findByText(/post 1 title/i)).to.exist;
            expect(cy.findByText(/post 1 description/i)).to.exist;
            expect(cy.findByText(/post 1 content/i)).to.exist;
            expect(cy.findByText(/tags: post1, post1, post1/i)).to.exist;

    })
})