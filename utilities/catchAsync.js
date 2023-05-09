// XX.03. We write an error handling function for all of our async routes:
// NOTE: We can just export it right away (shortly we return a function that accepts a function, and executes that function)
// AFTER: Now we can require it in our app.js (XX.04.)
module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    }
}

