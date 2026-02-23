class RouteNotFoundError extends Error{
    constructor(){
        super("handler not found")
    }
}

export {
    RouteNotFoundError,
}
