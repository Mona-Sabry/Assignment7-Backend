export function globalErrorMiddleware(err, req,res,next){
res.status(err.status ||500).json({errmsg: err.message , stack: err.stack , err: err})
}