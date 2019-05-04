const defaultImageSource = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88";

export default {
    data() {
        return {
            imageSource: defaultImageSource,
            image: null
        }
    },
    methods: {

        /**
         * Open up the image picker on the device by triggering a click into an input[type="file"]
         */
        selectImage() {
            this.$refs["image_picker"].click()
        },

        /**
         * The user has selected an Image, we validate it, resize it and then show the preview, 
         * ready to upload upon user registration
         */
        async imageSelected(event) {
            const files = event.target.files

            try {
                let resizedImage = await this.resizeImage(files[0])
                this.imageSource = resizedImage.url
                this.image = resizedImage.image
            } catch (e) {
                return
            }
        },

        /**
         * Method to resize an image to "compress" it until it's less than 500px in height or in width
         * @param {File} file The image to resize.
         */
        resizeImage(file) {
            return new Promise((resolve, reject) => {
                // Ensure it's an image
                if (file.type.match(/image.*/)) {

                    const reader = new FileReader()
                    reader.onload = (event) => {
                        const image = new Image()
                        image.onload = (imageEvent) => {
                            // resize the image
                            const canvas = document.createElement("canvas")
                            const maxSize = 500
                            let width = image.width
                            let height = image.height

                            if (width > height) {
                                if (width > maxSize) {
                                    height *= maxSize / width
                                    width = maxSize
                                }
                            } else {
                                if (height > maxSize) {
                                    width *= maxSize / height
                                    height = maxSize
                                }
                            }

                            canvas.width = width
                            canvas.height = height
                            canvas.getContext("2d").drawImage(image, 0, 0, width, height)
                            const dataUrl = canvas.toDataURL("image/jpeg")
                            const resizedImage = this.dataURLToBlob(dataUrl)

                            // we return both the dataurl and the resized image, once is used to upload, the over to show the preview image
                            resolve({
                                image: resizedImage,
                                url: dataUrl
                            })
                        }
                        image.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                } else {
                    reject()
                }
            })
        },
        /**
         * Utility method to convert a dataURL to a BLOB
         * @param {DOMString} dataURL The DataURL to convert to a BLOB
         */
        dataURLToBlob(dataURL) {
            let BASE64_MARKER = ';base64,';
            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                let parts = dataURL.split(',');
                let contentType = parts[0].split(':')[1];
                let raw = parts[1];

                return new Blob([raw], { type: contentType });
            }

            let parts = dataURL.split(BASE64_MARKER);
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }
    }
}