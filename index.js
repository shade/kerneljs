
// Load the image into the canvas and return the matrix of pixels.
function Load(e) {
    // Load in the image 
    let img = new Image();
    img.onload = draw;
    img.src = URL.createObjectURL(this.files[0]);
}

function draw() {
    let img = this;
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0,0);
    
    let imageArray = ctx.getImageData(0, 0, img.width, img.height);


    // Load in the kernel
    let kernel = document.getElementById('kernel').value
        .split("\n")
        .map(numList => numList
            .split(",")
            .map(num => parseFloat(num)));

    // Applies a given kernel to a given image, returns new image to render on canvas.
    let image_data = ApplyKernel(imageArray, kernel);
            console.log(image_data)
    // Paint the filtered image on the final canvas.
    let final = document.getElementById('final');
    final.height = img.height;
    final.width = img.width;
    final.getContext('2d').putImageData(image_data, 0, 0);
}

// Process the image by applying the kernel.
function ApplyKernel(img, kern) {
    let height = img.height;
    let width = img.width
    // Create and allocate a new array to hold the new image.
    let new_image = new Uint8ClampedArray(4 * height * width);
    new_image.fill(255);
    // Iterate through each of the channels: R,G,B
    for(var channel = 0; channel < 3; channel++) {
        // Iterate through each of the pixels in the image.
        for (var X = 0; X < width; X++) {
            for(var Y = 0; Y < height; Y++) {

                let filtered_value = 0;
                for (var y = 0; y < kern.length; y++) {
                    for (var x = 0; x < kern[0].length; x++) {

                        // collect the necessary kernel values.
                        let kern_y_shift = ~~(kern.length / 2) - y;
                        let kern_x_shift = ~~(kern[0].length / 2) - x;

                        // Map to the appropriate point 
                        let point = mapPoint(X + kern_x_shift,Y + kern_y_shift, height, width, channel);
                        // Apply kernel and add to filtered value.
                        filtered_value += img.data[point]*kern[y][x];
                    }
                }

                // Update the new image at the appropriate pixel.
                new_image[mapPoint(X,Y,height,width,channel)] = filtered_value;
            }
        }
    }

    return new ImageData(new_image, img.width, img.height);
}



function mapPoint(x,y, height, width, channel) {
    return (y * (width * 4)) + (x * 4) + channel;
}


document.getElementById('image_upload').onchange = Load;
