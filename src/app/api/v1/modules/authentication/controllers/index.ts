import Boom from '@hapi/boom';
import ResponseHelper from '@rpc/response';
import JwtAuthSign from '@authentication/jwt/jwtAuthSign';
import AuthenticationModel from '../models/authenticationModel';

const login = async (request, reply) => {
  try {
    const username = request.body.username;
    const password = request.body.password;

    const login = await AuthenticationModel.auth(username,password);
    if(login.error==null){
      if(login.data!==null){
        let userdata = {
            username : login.data.username,
            password: login.data.password
        };

        delete userdata.password;
        let jwtToken = JwtAuthSign.default(userdata);
        if(jwtToken!=null){
          ResponseHelper.sendResponseHTTP(reply, 200, "auth success", {'access-token': jwtToken});
        }else{
          ResponseHelper.sendResponseHTTP(reply, 500);
        }
      }else{
        ResponseHelper.sendResponseHTTP(reply, 401, "auth data not found");
      }
    }else{
      ResponseHelper.sendResponseHTTP(reply, 400);
    }
  } catch (err) {
    throw Boom.boomify(err)
  }
};

const test = async (request, reply) => {
  if (!request.auth.isAuthenticated) {
    ResponseHelper.sendResponseHTTP(reply, 401, "failed");
  }else{
    ResponseHelper.sendResponseHTTP(reply, 200, "authenticated",{auth:request.auth.userdata});
  }
};

export default {
  login,
  test
}
