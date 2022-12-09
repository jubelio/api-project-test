const authorizationBearer = {
    required: ['authorization'],
    type: 'object',
    properties: {
      authorization: { type: 'string', default: 'Bearer ', example: 'Bearer ' }
    }
  };


export default {
 authorizationBearer
}