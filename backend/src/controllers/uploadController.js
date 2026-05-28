const asyncHandler =
  require("../middlewares/asyncHandler");

const cloudinary =
  require("../config/cloudinary");

const uploadAvatar =
  asyncHandler(
    async (req, res) => {
      try {
        if (!req.file) {
          res.status(400);

          throw new Error(
            "No image uploaded"
          );
        }

        const base64 =
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result =
          await cloudinary.uploader.upload(
            base64,
            {
              folder:
                "pricelens/avatars",
            }
          );

        res.status(200).json({
          imageUrl:
            result.secure_url,
        });
      } catch (error) {
        console.log(
          "CLOUDINARY ERROR:"
        );

        console.log(error);

        res.status(500);

        throw new Error(
          "Cloudinary upload failed"
        );
      }
    }
  );

module.exports = {
  uploadAvatar,
};