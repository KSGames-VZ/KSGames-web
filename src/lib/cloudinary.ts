export const openUploadWidget = (callback: (error: any, result: any) => void) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        console.error("Cloudinary credentials missing");
        return;
    }

    // @ts-ignore
    if (window.cloudinary) {
        // @ts-ignore
        window.cloudinary.createUploadWidget(
            {
                cloudName,
                uploadPreset: "ks_preset",
                sources: ["local", "url", "camera"],
                multiple: true,
                maxFiles: 5,
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    callback(null, result.info);
                } else if (error) {
                    callback(error, null);
                }
            }
        ).open();
    }
};
