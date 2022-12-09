'use strict';

export default {
  sendResponseHTTP: function(reply, code: number, message?: string, data?: any) {
    const response_success = [200,201];
    const response_failed = [400,404,409,401,500];
    let response = {}

    if(!(response_success.includes(code) || response_failed.includes(code))){
      code = 400;
    }

    if(response_success.includes(code)){
      if(message==null){
        message="success";
      }
      response={ statusCode: code,
                 message: message,
                 data: data
               }
    }

    if(response_failed.includes(code)){
      if(message==null){
        message="failed";
      }
      response={ statusCode: code,
                 message: message
               }
    }

    reply.code(code).send(response);
  },
  success: function(reply, message?: string, data?: any) {
    const code = 200
    let response = {}
    if(message==null){
      message="Success";
    }
    response={ 
      statusCode: code,
      message: message,
      data: data
    }
    reply.code(code).send(response);
  },
  created: function(reply, message?: string, data?: any) {
    const code = 201
    let response = {}
    if(message==null){
      message="Created";
    }
    response={ 
      statusCode: code,
      message: message,
      data: data
    }
    reply.code(code).send(response);
  },
  badRequest: function(reply, message?: string, data?: any) {
    const code = 400
    let response = {}
    if(message==null){
      message="Bad Request";
    }
    response={ 
      statusCode: code,
      message: message,
      error: data
    }
    reply.code(code).send(response);
  },
  unauthorized: function(reply, message?: string, data?: any) {
    const code = 401
    let response = {}
    if(message==null){
      message="Unauthorized";
    }
    response={ 
      statusCode: code,
      message: message
    }
    reply.code(code).send(response);
  },
  notFound: function(reply, message?: string, data?: any) {
    const code = 404
    let response = {}
    if(message==null){
      message="Not found.";
    }
    response={ 
      statusCode: code,
      message: message
    }
    reply.code(code).send(response).hijack();
  }
}
