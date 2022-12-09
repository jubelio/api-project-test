'use strict';

import fs from 'fs';
import FileUtilities from './utilities';

export default {
    fileSoftDelete: function(filepath: any, filename: string): void {
        const filePathDefinition:any = FileUtilities.buildPath(filepath);
        const fileDir = filePathDefinition.fileDir;
        const newFileDir = `${fileDir}/unused/`

        const oldFilePath = `${fileDir}/${filename}`;
        const newFilePath = `${newFileDir}/${filename}`;

        FileUtilities.createDirectoryIfDoesntExist(newFileDir);
        fs.rename(oldFilePath, newFilePath, function (err) {
            if (err){
                console.log(err)
            }
        }); 
    },
    fileHardDelete: function(filepath: any, filename: string): void {
        const filePathDefinition:any = FileUtilities.buildPath(filepath);
        const fileDir = filePathDefinition.fileDir;
        const filePath = `${fileDir}/${filename}`;
        fs.unlinkSync(filePath);
    },
    getDirPath: function(filepath: any){
        const filePathDefinition:any = FileUtilities.buildPath(filepath);
        const fileDir = filePathDefinition.fileDir;
        const filePath = `${fileDir}`;
        return filePath;
    },
    deleteDirectoryRecursive: function(filepath: any){
        const filePathDefinition:any = FileUtilities.buildPath(filepath);
        const fileDir = filePathDefinition.fileDir;
        const filePath = `${fileDir}`;
        fs.rmSync(filePath, { recursive: true, force: true });
    }
}
