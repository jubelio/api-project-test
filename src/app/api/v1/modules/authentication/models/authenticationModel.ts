import { Prop as  Postgres } from "@/lib/connection/database/postgres";

const Db = Postgres.connection.DEFAULT;
const { QueryTypes } = Postgres.Sequelize;


class AuthenticationModel{
  constructor(){

  }

  async index(){

  }

  static async auth(username: string,password: string){
    var response:any = {}
    await Db.query(
     `SELECT username
      FROM users
      WHERE username=$username
            AND password=$password`,
      {
        bind: {
          username: username,
          password: password
        },
        type: QueryTypes.SELECT,
        plain: true,
        raw: true
      }
    ).then((value) => {
      response = {
        data: value
      };
    }).catch(err => {
      response = {
        error: err
      };
    });
    return response;
  }

}

export default AuthenticationModel;
