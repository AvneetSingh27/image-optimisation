const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const getColors = require('get-image-colors');

//Home path 
const HOME = `${__dirname}/../views/index.ejs`;


//Set Storage Engine
const storage = multer.diskStorage({
    destination: `${__dirname}/../public/uploads/`,
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('Image');

//Check File type
function checkFileType(file,cb){
    //Allowed file types
    const filetypes = /jpeg|jpg|png|gif/;
    //Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    //Check Mimetype
    const Mimetype = filetypes.test(file.mimetype);

    if(extname && Mimetype){
        return cb(null,true);
    }
    else{
        cb('Error: Images Only!(jpeg,jpg,png,gif are only supported formats)');
    }
}

//Middleware for uploading image
const uploadImage = (req,res,next) => {
    upload(req,res,(err) => {
        if(err){
            res.render(HOME,{
                msg: err
            });
        }else{
            if(`${req.file}` == 'undefined'){
                res.render(HOME,{
                    msg: 'Error: File not Selected!'
                });
            }
        }
        next();
    });
   
};
    



//Middleware for Resizing Image
const resizeImage = async (req,res,next) => {
     try{
        
        if(`${req.file}` != 'undefined'){
        const FILENAME = `${req.file.filename}`.split('.').slice(0,-1).join('.');
        const ORIGINAL_FILE = `${__dirname}/../public/uploads/${req.file.filename}`;
        await sharp(ORIGINAL_FILE)
        .resize({width: 64})
        .toFile(`${__dirname}/../public/uploads/${FILENAME}-thumb${path.extname(req.file.originalname)}`);

        await sharp(ORIGINAL_FILE)
        .resize({width: 256})
        .toFile(`${__dirname}/../public/uploads/${FILENAME}-small${path.extname(req.file.originalname)}`);

        await sharp(ORIGINAL_FILE)
        .resize({width : 512})
        .toFile(`${__dirname}/../public/uploads/${FILENAME}-medium${path.extname(req.file.originalname)}`);

        await sharp(ORIGINAL_FILE)
        .resize({width: 800})
        .toFile(`${__dirname}/../public/uploads/${FILENAME}-large${path.extname(req.file.originalname)}`);

        await sharp(ORIGINAL_FILE)
        .resize({width : 1024})
        .toFile(`${__dirname}/../public/uploads/${FILENAME}-xlarge${path.extname(req.file.originalname)}`);

        res.render(HOME,{
            heading : 'Image Resized! & Displayed according to the window size',
            O_FILE : `uploads/${req.file.filename}`,
            S_FILE : `uploads/${FILENAME}-small${path.extname(req.file.originalname)}`,
            M_FILE : `uploads/${FILENAME}-medium${path.extname(req.file.originalname)}`,
            L_FILE : `uploads/${FILENAME}-large${path.extname(req.file.originalname)}`,
            XL_FILE : `uploads/${FILENAME}-xlarge${path.extname(req.file.originalname)}`
        }); 
        }
     }catch(err){
         console.log('Error: ',err);
     }
     next();
}




//Middleware for Image Conversion
const convertImage = async (req,res) =>{
    try{
        if(`${req.file}` != 'undefined'){
        const FILENAME = `${req.file.filename}`.split('.').slice(0,-1).join('.');
        const ORIGINAL_FILE = `${__dirname}/../public/uploads/${req.file.filename}`;
        const extension  = `${path.extname(req.file.originalname)}`;
        if(extension == '.png') {
            await sharp(ORIGINAL_FILE)
            .jpeg({
                quality: 100,
                chromaSubsampling: '4:4:4'
              })
            .toFile(`${__dirname}/../public/uploads/${FILENAME}.jpg`);
        }
        else if(extension == '.jpg'){
            await sharp(ORIGINAL_FILE)
            .png()
            .toFile(`${__dirname}/../public/uploads/${FILENAME}.png`);
        }

        res.render(HOME,{
            heading : 'Image Converted Successfully!'
        }); 
    }
    }catch(error){
        console.log(error);
    }
}




//Middleware for colour codes
const getColorCodes = async (req,res) =>{
    try{
        if(`${req.file}` != 'undefined'){
        const ORIGINAL_FILE = `${__dirname}/../public/uploads/${req.file.filename}`;
        const options ={
            count: 5 //Number of Colors returned
        }
        const colors  = await getColors(ORIGINAL_FILE,options);
        //colors.map(color => color.hex());
        colors.forEach(color =>{
            console.log(color.css());
        });
        res.render(HOME,{
            heading : 'Colors Extracted! Color Codes are listed below',
            content: colors
        });
        }
    }catch(err){
        console.log(err);
    }
}


module.exports = {
    uploadImage : uploadImage,
    resizeImage : resizeImage,
    convertImage : convertImage,
    getColorCodes : getColorCodes
};