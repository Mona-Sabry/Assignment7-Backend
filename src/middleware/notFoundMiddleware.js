export function notFoundMiddleware (req , res){
    res.status(404).json({msg: `Invalid URL ${req.url} or Method ${req.method}`});
}