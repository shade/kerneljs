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

    loadImage(data: Uint8ClampedArray[]) {
        for(var i = 0; i < data.length; i++) {
            let channel = ['r','g','b','a'][i % 4];
            let position = ~~(i / 4);

            this.raw[channel][position] = data[i];
        }
    }

    exportImage(): ImageData { return null; }
}

class Image {
    height: number;
    width: number;
    data: Vector;

    constructor(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext("2d");
        let image = ctx.getImageData(0, 0, canvas.height, canvas.width);

        this.data = new Vector([image.height, image.width]);
        this.data.loadImage(image.data);
    }
}