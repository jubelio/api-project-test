'use strict';
import { v4 as uuidv4 }  from 'uuid';
import fs from 'fs';
import Hoek from '@hapi/hoek';
import XConfig from '@config/_core';
import FileUtilities from './utilities';

const defaultAllowedMimeType = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text'
]

type FileBuffer = {
    filename: string,
    encoding: string,
    mimetype: string,
    data: any
}

type UploadConfig = {
    allowedMimeType?: string[],
    minumumAllowedFiles?:number,
    maximumAllowedFiles?:number,
    filesize?: number,
    filepath?: any 
}

// Response
type UploadFileStatus = {
    isUploaded: boolean,
    data?: any,
    error?: any
}

type UploadFileSummary = {
    uploadFailed: number,
    uploadSuccess: number,
    Uploadedfilename: Array<string>
}

type UploadFileResponse = {
    summary: UploadFileSummary,
    detail: Array<UploadFileStatus>
}

const configDefault:UploadConfig = {
    minumumAllowedFiles: 1,
    maximumAllowedFiles: 1,
    allowedMimeType: defaultAllowedMimeType,
    filesize: 10000000, //10MB
    filepath: {
        root: XConfig.get('/application/staticFile/definition/default'),
        manifest: 'default'
      }
};


export { UploadConfig };
export default {
    uploadBuffer: function(files: [FileBuffer], configOptions?: UploadConfig): UploadFileResponse {
        let uploadSummary: UploadFileSummary = {
            uploadFailed:0,
            uploadSuccess:0,
            Uploadedfilename: []
        };
        let uploadStatus:Array<UploadFileStatus>=[];

        //CONFIG
        const config = Hoek.applyToDefaults(configDefault, configOptions);
        const filePathDefinition:any = FileUtilities.buildPath(config.filepath);
        const fileDir = filePathDefinition.fileDir;
        const fileDirPublic = filePathDefinition.fileDirPublic;

        if(files.length>=config.minumumAllowedFiles && files.length<=config.maximumAllowedFiles){
            for(const file of files){
                const originalFileName = file.filename;
                const fileExtension = FileUtilities.getFileExtension(originalFileName);
                let response:UploadFileStatus;
                let fileSizeInBytes: number = 0;
                let finalFileName:string = originalFileName;
                let fileDirPath:string;
                let checkErrors = [];  
    
                // Check Mime
                if(!config.allowedMimeType.includes(file.mimetype)){
                    const allowedMimeTypeString = JSON.stringify
                    checkErrors.push(`Allowed Mime Type are (${config.allowedMimeType.join(',')}), your file Mime Type is "${file.mimetype}"`);
                }
    
     
                // Try to upload the file
                if(checkErrors.length==0){
                    FileUtilities.createDirectoryIfDoesntExist(fileDir);
                    finalFileName = `${uuidv4()}.${fileExtension}`;
                    fileDirPath = `${fileDir}/${finalFileName}`;
                    try {
                        fs.writeFileSync(fileDirPath, file.data);
                        // Check File Size
                        let fileStats = fs.statSync(fileDirPath);
                        fileSizeInBytes = fileStats.size;
                        if(fileSizeInBytes>config.filesize){
                            checkErrors.push(`Maximum filesize is "${config.filesize}" Bytes, your filesize was "${fileSizeInBytes}" Bytes`);
                            fs.unlinkSync(fileDirPath);
                        }
                    } catch(err) {
                        console.error(err);
                        checkErrors.push(err);
                    }
                }
    
                if(checkErrors.length==0){
                    uploadSummary.uploadSuccess+=1;
                    uploadSummary.Uploadedfilename.push(finalFileName);
                    response = {
                        isUploaded: true,
                        data: {
                            filesize: fileSizeInBytes,
                            originalFilename: originalFileName,
                            uploadedFilename: finalFileName,
                            localPath: fileDirPath,
                            accessibleUrl: `${fileDirPublic}/${finalFileName}`
                        }
                    };
                }else{
                    uploadSummary.uploadFailed+=1;
                    response = {
                        isUploaded: false,
                        data: {
                            originalFilename: originalFileName
                        },
                        error: checkErrors
                    };
                }
    
                uploadStatus.push(response);
            }
        }else{
            for(const file of files){
                let response:UploadFileStatus;
                uploadSummary.uploadFailed+=1;
                let wording;

                if(config.minumumAllowedFiles==config.maximumAllowedFiles){
                    wording = `be ${config.minumumAllowedFiles}`;
                }else{
                    wording = `between ${config.minumumAllowedFiles} and ${config.maximumAllowedFiles}`;
                }
                response = {
                    isUploaded: false,
                    data: {
                        originalFilename: file.filename
                    },
                    error: [`Total Uploaded files must ${wording}`]
                };
                uploadStatus.push(response);
            }
        }
        
        
        
        return {
            summary: uploadSummary,
            detail: uploadStatus
        }
            
    }
}
