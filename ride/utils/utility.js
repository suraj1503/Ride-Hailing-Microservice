class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        // console.log(statusCode,"errorHandler")
        this.statusCode=statusCode;
    }
}

export default ErrorHandler