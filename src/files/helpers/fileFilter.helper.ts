import { error } from "console"


export const fileFilter = (rep: Express.Request, file: Express.Multer.File, callback: Function) => {
    // Si el archivo viene vacio
    if(!file) return callback(new Error('File is empty'), false);
    // extraer la extencion del archivo
    const fileExceptension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

    if(validExtensions.includes(fileExceptension)){
        return callback(null, true)
    }
    
    callback(null, false)
}