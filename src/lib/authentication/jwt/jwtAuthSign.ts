'use strict';
import JWT from 'jsonwebtoken';
import XConfig from '@/config/_core';

const jwtAuthSignDefault = function jwtAuthSign(userdata: any) {
    let jwtAuthOptions = XConfig.get('/jwtAuthOptions/default');

    type jwtPayload = {
      userdata: any;
      aud?: string;
      iss?: string;
      sub?: boolean;
      nbf?: number;
      exp?: number;
      maxAgeSec?: number;
      timeSkewSec?: number;
    };

    let payload: jwtPayload = {
      userdata: userdata
    }
    if(jwtAuthOptions.verify!=false){
      if(jwtAuthOptions.verify.aud!=null){ payload.aud = jwtAuthOptions.verify.aud;}
      if(jwtAuthOptions.verify.iss!=null){ payload.iss = jwtAuthOptions.verify.iss;}
      if(jwtAuthOptions.verify.sub!=null){ payload.sub = jwtAuthOptions.verify.sub;}
      if(jwtAuthOptions.verify.nbf!=null){ payload.nbf = jwtAuthOptions.verify.nbf;}
      if(jwtAuthOptions.verify.exp!=null){ payload.exp = jwtAuthOptions.verify.exp;}
      if(jwtAuthOptions.verify.maxAgeSec!=null){ payload.maxAgeSec = jwtAuthOptions.verify.maxAgeSec;}
      if(jwtAuthOptions.verify.timeSkewSec!=null){ payload.timeSkewSec = jwtAuthOptions.verify.timeSkewSec;}
    }
    try {
      let jwtToken = JWT.sign(payload, jwtAuthOptions.key, {algorithm: jwtAuthOptions.algorithm});
      return jwtToken;
    } catch (error) {
      console.log(error)
      return null;
    }


}

export default {
  default: jwtAuthSignDefault
};
