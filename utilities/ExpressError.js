//                  XX. DEFINING EXPRESS ERROR CLASS

// XX.01. Here we define our class that extends the default error:
// NOTE: If you don't get something here, read the error docs!
class ExpressError extends Error {
    constructor(message, statusCode ){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// XX.02. Then we need to export it:
// AFTER: We make a utility for catchAsync function, see utilities/catchAsync.js (XX.03. )
module.exports = ExpressError;

