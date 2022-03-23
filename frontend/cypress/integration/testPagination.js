//PLEASE DELETE ALL YOUR POSTS FROM BACKEND FOR THIS TO WORK PROPERLY

describe('testPagination', () => {

    it('posts are paginated', () => {
        //test to see if post pagination works, 5 unique posts per page
        
        cy.visit('http://localhost:3000/home');

        //create 11 posts
            for (let i = 0; i < 11; i++){
            const postTitle = 'post ' + i + ' title';
            const postDescription = 'post ' + i + ' description';
            const postContent = 'post ' + i + ' content';
            const postTags = 'post' + i + ', post1' + i + ', post' + i;
            cy.wait(200);
            expect(cy.findByTestId('AddCircleOutlineIcon')).to.exist;
            cy.findByTestId('AddCircleOutlineIcon').click();
                cy.findByPlaceholderText(/title!/i).type(postTitle);
                cy.findByPlaceholderText(/describe it a little/i).type(postDescription);
                cy.findByPlaceholderText(/what's in your mind?/i).type(postContent);
                cy.findByPlaceholderText(/add tags!/i).type(postTags); 
                
                
                cy.findByRole('button', {  name: /share/i}).click();
                cy.wait(200);
        } 
 
        //check if there are 5 unique posts per page

        cy.findByRole('button', {  name: /page 1/i}).click();
        const postTitles = [];
        for (let i = 0; i < 4; i++){
            const postTitle = 'post ' + i + ' title';
            expect(cy.findByText(postTitle)).to.exist;
            expect(postTitles.includes(postTitle)).to.equal(false);
            postTitles.push(postTitle);
        }
        cy.findByRole('button', {  name: /page 2/i}).click();
        for (let i = 4; i < 9; i++){
            const postTitle = 'post ' + i + ' title';
            expect(cy.findByText(postTitle)).to.exist;
            expect(postTitles.includes(postTitle)).to.equal(false);
            postTitles.push(postTitle);
        }
        cy.findByRole('button', {  name: /page 3/i}).click();
        for (let i = 9; i < 11; i++){
            const postTitle = 'post ' + i + ' title';
            expect(cy.findByText(postTitle)).to.exist;
            expect(postTitles.includes(postTitle)).to.equal(false);
            postTitles.push(postTitle);
        }
        expect(postTitles.length).to.equal(11);



    })
})