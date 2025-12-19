### ProfileHeader Component:



### Purpose
1. Displays user avatar, name, and status, Allows user to update Pfp.
2. Logout & Sound Option.


### Handling Pfp Updates:
<pre>
User clicks on profile picture button
             │
             ▼
Hidden <input type="file"> is triggered via ref (useRef)
             │
             ▼
User selects an image file
             │
             ▼
Frontend JS checks file type with handlePfpChange() function.
  ├─ If not an image → show toast "Only image files allowed" → STOP
  └─ If image → continue
             │
             ▼
Frontend compresses image using browser-image-compression
  ├─ Max size: 1MB
  └─ Max dimensions: 500x500
             │
             ▼
FileReader reads compressed image as Base64
             │
             ▼
FileReader onloadend triggers:
  ├─ Set selectedImageFile state to Base64 → shows preview
  └─ Call updateProfile({ profilePic: base64Image })
             │
             ▼
updateProfile (frontend store) sends PUT request to backend
  isUpdatingProfile becomes true -> shows loading icon.
  URL: /api/auth/updateProfile
  Body: { profilePic: <Base64 string> }
             │
             ▼
Backend receives request via Express
  ├─ Middleware parses JSON - in server.js, Line 31 (limit 5MB).
  └─ Pass Arcjet and Cookies & Auth check.
             │
             ▼
Backend validates profilePic:
  ├─ profilePic exists
  ├─ profilePic is a string
  ├─ profilePic starts with "data:image/"
  └─ profilePic length ≤ 5MB
        │
        └─ If any fails → send error JSON → frontend toast shows error
             │
             ▼
Upload Base64 image to Cloudinary
  ├─ Folder: Chatterly/profile_pics
  ├─ public_id: `user_${req.user._id}`,
  ├─ Transformation: width=500, height=500, crop=limit
  ├─ overwrite=true, invalidate=true → ensures new pic shows immediately
             │
             ▼
Cloudinary returns secure URL of uploaded image in uploadResponse.
             │
             ▼
Update user's document in MongoDB
  ├─ findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url })
  └─ return updated user object (without password)
             │
             ▼
Backend responds with updated user JSON
             │
             ▼
Frontend receives updated user JSON
  ├─ authUserInfo store is updated with new user object
  ├─ selectedImageFile remains Base64 for preview
  └─ Show toast "Profile updated successfully!"
  └─ isUpdatingProfile becomes false -> shows pfp.
             │
             ▼
User sees updated profile picture immediately.
</pre>