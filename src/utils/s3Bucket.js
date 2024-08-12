import AWS from 'aws-sdk';



const S3_BUCKET = 'familyvibes';
const REGION = 'ap-south-1';


// AWS.config.update({
//     accessKeyId: 'AKIARSRDUAFZ2TZJRAEO',
//     secretAccessKey: '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',
//     correctClockSkew: true
// })

AWS.config.update({
    accessKeyId: 'AKIARSRDUAFZVZY6VLRE',
    secretAccessKey: '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',
    correctClockSkew: true
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
})


var progress = 0;
function base64ImageToBlob(str) {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);

    // decode base64
    var imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for (var n = 0; n < imageContent.length; n++) {
        view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    var blob = new Blob([buffer], { type: type });

    return blob;
}
// export const uploadFile = (file, tempName = null) => {
//     // console.log('file', file)
// // uploadOnCloudinary()
//     const data  = new FormData();
//     data.append('file', file)
//     data.append('upload_preset', 'familyvibes')
//     data.append('cloud_name', 'dvokzucfn')
//     fetch("https://api.cloudinary.com/v1_1/dvokzucfn/image/upload",{
//         method:"post",
//         body:data

    
//     }).then(res => res.json())
//     .then((data) => {
//         console.log(data)
        
//     })




















//     // const name = `${Date.now()}.${tempName ? tempName : file.name}`
    
//     // const tempFile = tempName ? base64ImageToBlob(file) : file
//     // const params = {
//     //     ACL: 'public-read',
//     //     Body: tempFile,
//     //     Bucket: S3_BUCKET,
//     //     Key: name
//     // };

//     // return new Promise((resolve, reject) => {
//     //     myBucket.putObject(params)
//     //         .on('httpUploadProgress', (evt) => {
//     //             progress = Math.round((evt.loaded / evt.total) * 100)
//     //         })
//     //         .send((err, data) => {
//     //             if (err) {
//     //                 console.log('########2', err)
//     //                 reject(null);
//     //             }
//     //             resolve(`https://familyvibes.s3.ap-south-1.amazonaws.com/${name}`);
//     //         })
//     // });



// }
export const uploadFile = (file, tempName = null) => {
 console.log(file)
};

