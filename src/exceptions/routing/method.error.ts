class MethodNotFound extends Error {
    constructor(){
        super("Handler whiout a method")
    }
}

class NotSuportedMethodError extends Error{
    constructor(){
        super("The method is not suported")
    }
}
export {
    MethodNotFound,
    NotSuportedMethodError
}
