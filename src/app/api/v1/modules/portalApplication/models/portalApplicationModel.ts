import { Prop as  Postgres } from "@/lib/connection/database/postgres";
const Db = Postgres.connection.DEFAULT;
const { QueryTypes } = Postgres.Sequelize;


class ApplicationModel{
  constructor(){

  }

  async index(){

  }

  static async getAll(){
    let response:any = {}
    await Db.query(
     `SELECT *
      FROM "applications"
      WHERE "deletedAt" IS NULL`,
      {
        bind: {},
        type: QueryTypes.SELECT,
        raw: true
      }
    ).then((value) => {
      response = {
        isQuerySuccess: true,
        data: value
      };
    }).catch(err => {
      console.log(err);
      response = {
        error: err
      };
    });
    return response;
  }

  static async getOne(id: number){
    let response:any = {}
    await Db.query(
     `SELECT *
      FROM "applications"
      WHERE id=$id
            AND "deletedAt" IS NULL`,
      {
        bind: {
          id: id
        },
        type: QueryTypes.SELECT,
        plain: true,
        raw: true
      }
    ).then((value) => {
      response = {
        isQuerySuccess: true,
        data: value
      };
    }).catch(err => {
      console.log(err);
      response = {
        error: err
      };
    });
    return response;
  }

  static async create(data:any){ 
    let response:any = {}
    await Db.query(
     `INSERT INTO "applications"
      ("name","description","logo","url","orderFrom","isActive")
      VALUES
      ($name,$description,$logo,$url,$orderFrom,$isActive)`,
      {
        bind: data,
        type: QueryTypes.INSERT,
        raw: true
      }
    ).then((value) => {
      response = {
        isQuerySuccess: true
      };
    }).catch(err => {
      console.log(err);
      response = {
        error: err
      };
    });
    return response;
  }

  static async update(id: number,data:any){ 
    let response:any = {}
    await Db.query(
     `UPDATE "applications"
      SET "name"=$name,
          "description"=$description,
          "url"=$url,
          "isActive"=$isActive,
          "updatedAt"=now()
      WHERE id=$id
            AND "deletedAt" IS NULL`,
      {
        bind: {
          id: id,
          name: data.name,
          description: data.description,
          url: data.url,
          isActive: data.isActive
        },
        type: QueryTypes.UPDATE,
        raw: true
      }
    ).then((value) => {
      response = {
        isQuerySuccess: true
      };
    }).catch(err => {
      console.log(err);
      response = {
        error: err
      };
    });
    return response;
  }

  static async updateLogo(id: number,data:any){ 
    let response:any = {}
    await Db.query(
     `UPDATE "applications"
      SET "logo"=$logo,
          "updatedAt"=now()
      WHERE id=$id
            AND "deletedAt" IS NULL`,
      {
        bind: {
          id: id,
          logo: data.logo
        },
        type: QueryTypes.UPDATE,
        raw: true
      }
    ).then((value) => {
      response = {
        isQuerySuccess: true
      };
    }).catch(err => {
      console.log(err);
      response = {
        error: err
      };
    });
    return response;
  }

  static async remove(id: number){ 
    let response:any = {}
    await Db.query(
     `UPDATE "applications"
      SET "deletedAt"=now()
      WHERE id=$id
            AND "deletedAt" IS NULL`,
      {
        bind: {
          id: id
        },
        type: QueryTypes.DELETE,
        raw: true
      }
    ).then((value) => {
      response = {
        isQuerySuccess: true
      };
    }).catch(err => {
      console.log(err);
      response = {
        error: err
      };
    });
    return response;
  }

}

export default ApplicationModel;
