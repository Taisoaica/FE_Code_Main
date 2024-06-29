interface HttpResponseModel<T> {
    statusCode: number;
    message?: string;
    detail?: string;
    content?: T;
}

export default HttpResponseModel;