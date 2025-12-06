import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';


if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_API_KEY || !ENV.CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary environment variable missing. Image uploads may fail.");
}


// Configuration
cloudinary.config({ 
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME, 
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET 
});
    
export default cloudinary;









//     // Upload an image
//      const uploadResponse = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResponse);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// ();





// Cloudinary --->  Store images online (cloud storage) : 

// 1. Profile pictures, cover photos, chat images, product images — all stored safely.
// 2. Automatically compress & optimize images for faster loading times.
// 3. Supports various image formats & transformations.
// 4 . Secure access & management of media assets.