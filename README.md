# imageprocessing
The application process an image by applying a low-level sharpen and mirror effect. The source image is contained in a JSON obtained from DOG API (https:// https://dog.ceo/dog-api/).
This JavaScript code consists of three functions: sharpen, mirror, and getImage.

The sharpen function applies a sharpening effect to an image using a convolution matrix. It takes the canvas rendering context, image width, height, and a mix parameter as inputs. The function processes each pixel of the image using the convolution matrix and mixes the resulting colors with the original pixel colors based on the mix parameter. The sharpened image data is then applied to the canvas.

The mirror function mirrors the given image horizontally. It takes the canvas rendering context, image width, height, and image data as inputs. The function swaps the pixel values from left to right, effectively creating a mirrored version of the image. The mirrored image data is then applied to the canvas.

The getImage function performs an asynchronous operation to fetch a random dog image from the "https://dog.ceo/api/breeds/image/random" API endpoint. Upon receiving the image URL, it loads the image, sets its cross-origin attribute, and draws it on a canvas. The function then measures the time taken to apply the mirror and sharpen effects to the image, displaying the processing time in milliseconds.
