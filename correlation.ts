
enum BOUNDARY_OPTION {
    WRAP_AROUND = 0,
    ZERO_PAD = 1,
    TRUNCATE = 2,
}

enum FILTER_OPTION {
    CONV = 0,
    CORR = 1
}


class ImageVector {
    shape: number[];
    raw: {
        r: Uint8ClampedArray,
        g: Uint8ClampedArray,
        b: Uint8ClampedArray,
        a: Uint8ClampedArray
    }

    constructor(shape: number | number[]) {
        let size = 0;
        switch(typeof shape) {
            case "number":
                size = shape;
                shape = [shape];
            case "object":
                size = shape.reduce((p, c) => (p * c),1);
        }

        this.shape = shape;
        this.raw = {
            r: new Uint8ClampedArray(shape),
            g: new Uint8ClampedArray(shape),
            b: new Uint8ClampedArray(shape),
            a: new Uint8ClampedArray(shape)
        };
    }

    loadImage(data: Uint8ClampedArray) {
        for(var i = 0; i < data.length; i++) {
            let channel = ['r','g','b','a'][i % 4];
            let position = ~~(i / 4);

            this.raw[channel][position] = data[i];
        }
    }

    exportImage(): ImageData { return null; }

    applyFilter(x,y: number, bounds: BOUNDARY_OPTION): ImageVector {
        
        return null;
    }
}


class Image {
    height: number;
    width: number;
    data: ImageVector;

    constructor(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext("2d");
        let image = ctx.getImageData(0, 0, canvas.height, canvas.width);

        this.data = new ImageVector([image.height, image.width]);
        this.data.loadImage(image.data);
    }


    filter(kern: number[][], type: FILTER_OPTION) {
        // Caching variables locally to improve speed.
        let height = this.width;
        let width = this.width;

        let kern_height = kern.length;
        let kern_width = kern[0].length;

        // Validate the kernel.
        let msg;
        if (msg = this.isValidKernel(kern)) {
            throw new Error("Invalid kernel provided: " + msg);
        }

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
    }

    isValidKernel(kern: number[][]): string {
        let kern_width = kern[0].length;

        for (var i = 0; i < kern.length; i++) {
            if (kern[i].length != kern_width) {
                return "Not all rows have the same width.";
            }
        }

        return null;
    }
}