import XConfig from '@config/_core';
import fs from 'fs';

export default {
    buildPath: function(filepath){
        const filePathDefinition:any = filepath.definition;
        const fileDir = `${filePathDefinition.directory}/${filePathDefinition.manifest[filepath.manifest]}`;
        const fileDirPublic = `${XConfig.get('/application/baseUrl')}/${filePathDefinition.prefix}/${filePathDefinition.manifest[filepath.manifest]}`;

        return {
            fileDir: fileDir,
            fileDirPublic: fileDirPublic
        }
    },
    createDirectoryIfDoesntExist: function(directoryPath:string){
        if (!fs.existsSync(directoryPath)){
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    },
    getFileExtension: function(filename: string){
        return filename.substring(filename.lastIndexOf('.')+1, filename.length) || undefined;
    }
}