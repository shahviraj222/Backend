// this is wraper class used to wrap any function in  the async handler so we don't have to write repeated code
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }


// higher order functions

// step 1 // const asyncHandler = (func) => {}
// step 2 // const asyncHandler = (func) => async ()=>{}

//Try Catch Function    
// const asyncHandler = (func) => async (err, req, res, next) => {
//     try {
//         await func(req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// } 