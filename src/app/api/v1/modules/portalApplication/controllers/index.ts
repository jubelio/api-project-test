import ResponseRPC from '@rpc/response';
import ApplicationModel from '../models/portalApplicationModel'; 
import FileUploader, { UploadConfig } from '@lib/files/file-uploader'
import FileManipulator from '@lib/files/file-manipulator';
import XConfig from '@config/_core';

const config: UploadConfig = {
  allowedMimeType: ['image/png','image/jpeg'],
  filepath: {
    definition: XConfig.get('/application/staticFile/definition/default'),
    manifest: 'imagesAppLogo'
  }
}

const list = async (request, reply) => {
  const getApplications = await ApplicationModel.getAll();
  if(getApplications.isQuerySuccess){
    ResponseRPC.success(reply,null,getApplications.data);
  }else{
    ResponseRPC.badRequest(reply);
  }
};

const detail = async (request, reply) => {
  let { applicationID } = request.params;
  const getApplication = await ApplicationModel.getOne(applicationID);
  if(getApplication.isQuerySuccess){
    if(getApplication.data!=null){
      ResponseRPC.success(reply,null,getApplication.data);
    }else{
      ResponseRPC.notFound(reply,`Data with applicationID='${applicationID}' not found.`);
    }
  }else{
    ResponseRPC.badRequest(reply);
  }
};

const create = async (request, reply) => {
  let { name, description=null, logo, url } = request.body;
  let processStatus=true;
  let processErrors=[];

  if(logo!=undefined){
    const uploadFile = FileUploader.uploadBuffer(logo, config);
    if(uploadFile.summary.uploadFailed==0){
      var filename = uploadFile.summary.Uploadedfilename[0];
    }else{
      processStatus=false;
      processErrors.push({
        summary: `Upload file 'logo' error.`,
        detail: uploadFile.detail
      });
    }
  }else{
    processStatus=false;
    processErrors.push({
      summary: `Upload file 'logo' error.`,
      detail: `No file uploaded`
    });
  }
  

  if(processStatus){
    const dataInsert = {
      name: name,
      description: description,
      logo: filename,
      url: url,
      orderFrom: 999,
      isActive: true
    }
    
    const insertData = await ApplicationModel.create(dataInsert);
    if(insertData.isQuerySuccess){
      ResponseRPC.created(reply,null,dataInsert);
    }else{
      ResponseRPC.badRequest(reply);
    }
  }else{
    ResponseRPC.badRequest(reply,null,processErrors);
  }
};

const update = async (request, reply) => {
  let { applicationID } = request.params;
  let { name, description, url, isActive } = request.body;
  const getApplication = await ApplicationModel.getOne(applicationID);
  if(getApplication.isQuerySuccess){
    if(getApplication.data!=null){
      const dataUpdate = {
        name: name,
        description: description,
        url: url,
        isActive: isActive
      }
      const updateData = await ApplicationModel.update(applicationID, dataUpdate);
      if(updateData.isQuerySuccess){
        ResponseRPC.success(reply,'Updated.',dataUpdate);
      }else{
        ResponseRPC.badRequest(reply);
      }
    }else{
      ResponseRPC.notFound(reply,`Data with applicationID='${applicationID}' not found.`);
    }
  }else{
    ResponseRPC.badRequest(reply);
  }
};

const updateLogo = async (request, reply) => {
  let { applicationID } = request.params;
  let { logo } = request.body;
  let processStatus=true;
  let processErrors=[];

  const getApplication = await ApplicationModel.getOne(applicationID);
  if(getApplication.isQuerySuccess){
    if(getApplication.data!=null){
      if(logo!=null){
        const uploadFile = FileUploader.uploadBuffer(logo, config);
        if(uploadFile.summary.uploadFailed==0){
          var filename = uploadFile.summary.Uploadedfilename[0];
        }else{
          processStatus=false;
          processErrors.push({
            summary: `Upload file 'logo' error.`,
            detail: uploadFile.detail
          });
        }
      }else{
        processStatus=false;
        processErrors.push({
          summary: `Upload file 'logo' error.`,
          detail: `No file uploaded`
        });
      }

      if(processStatus){
        const dataUpdate = {
          logo: filename
        }
        
        const updateData = await ApplicationModel.updateLogo(applicationID, dataUpdate);
        if(updateData.isQuerySuccess){
          FileManipulator.fileSoftDelete(config.filepath, getApplication.data.logo);
          ResponseRPC.success(reply,'Updated.',dataUpdate);
        }else{
          ResponseRPC.badRequest(reply);
        }
      }else{
        ResponseRPC.badRequest(reply,null,processErrors);
      }
    }else{
      ResponseRPC.notFound(reply,`Data with applicationID='${applicationID}' not found.`);
    }
  }else{
    ResponseRPC.badRequest(reply);
  }

};

const remove = async (request, reply) => {
  let { applicationID } = request.params;
  const getApplication = await ApplicationModel.getOne(applicationID);
  if(getApplication.isQuerySuccess){
    if(getApplication.data!=null){
      const deleteData = await ApplicationModel.remove(applicationID);
      if(deleteData.isQuerySuccess){
        FileManipulator.fileSoftDelete(config.filepath, getApplication.data.logo);
        ResponseRPC.success(reply,'Deleted.');
      }else{
        ResponseRPC.badRequest(reply);
      }
    }else{
      ResponseRPC.notFound(reply,`Data with applicationID='${applicationID}' not found.`);
    }
  }else{
    ResponseRPC.badRequest(reply);
  }
  
  
  
};



export default {
  list,
  detail,
  create,
  update,
  updateLogo,
  remove
}
