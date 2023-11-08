function sharpen (context, width, height, mix) {   
  //create an empty element with the given width/height
  let dstData = context.createImageData(width,height),
      dstBuff = new Uint32Array(dstData.data.buffer);        
  //collection of information
  let pixel = context.getImageData(0,0,width,height),
      data = new Uint32Array(pixel.data.buffer);    
  //convolution matrix
  let kernel = [[0, -1, 0],
               [-1, 5, -1],
               [0, -1, 0]],
      katet = Math.round(Math.sqrt(kernel.length))+1,//root 9=3
      half = (katet * 0.5) | 0;//3*0.5=1.5 discard values ​​after the decimal point      
  //pixel processing
  let dstIndex = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;
        for (let sy = 0; sy < katet; sy++) {
          const yy = Math.min(height - 1, Math.max(0, y + sy - half));
          for (let sx = 0; sx < katet; sx++) {
            const xx = Math.min(width - 1, Math.max(0, x + sx - half));
            let pix = data[yy * width + xx];                    
            r += ((pix & 0xFF) * kernel[sy][sx]);
            g += ((((pix) >> 8) & 0xFF) * kernel[sy][sx]);
            b += ((((pix) >> 16) & 0xFF) * kernel[sy][sx]); 
          }
        }        
        red = Math.min(255,Math.max(0, (r*mix)+((data[y * width + x] )&0xFF)*(1-mix) ))&0xFF;
        green = Math.min(255, Math.max(0, (g*mix)+(((data[y * width + x])>> 8)&0xFF)*(1-mix) ))&0xFF;
        blue = Math.min(255, Math.max(0, (b*mix)+(((data[y * width + x])>> 16)&0xFF)*(1-mix) ))&0xFF;
        const alfa = data[y * width + x] & 0xFF000000;

        dstBuff[dstIndex++] = red | ((green) << 8) | ((blue) << 16) | alfa | ((blue) << 16);//fill with changes
      }
    }
    context.putImageData(dstData, 0, 0);//overwriting the canvas with new data         
}

function mirror (ctx, width, height, imgData) {   
  rowOffset = 0;
  rowWidthInBytes = 4*width;
  for (row = 0; row < height ; row++){
    index = rowOffset;
    for(columnOffsetInBytes = rowWidthInBytes - 4; columnOffsetInBytes > 0 ; columnOffsetInBytes -=8){
        for(i = 0 ; i < 4 ; i++){
              tmp = imgData.data[index + columnOffsetInBytes];
              imgData.data[index + columnOffsetInBytes] = imgData.data[index];
              imgData.data[index++] = tmp;
         }
    }
  rowOffset += rowWidthInBytes;
  }
  ctx.putImageData(imgData, 0, 0);
} 

async function getImage() {
  const req = new XMLHttpRequest();
  req.onload = async function () {
    const ob = JSON.parse(this.responseText);
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    var img = new Image();
    await new Promise(resolve => setTimeout(resolve, 1000));
    img.onload = async function () {
      canvas.width = img.width;
      canvas.height = img.height;
      img.crossOrigin = "Anonymous";
      document.getElementById("JSONtxt").innerHTML = `Image URL: ${img.src}`;
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, img.width, img.height);
      let start1 = performance.now();
      setTimeout(async () => {
        mirror (ctx, img.width, img.height, imgData);
      }, 1000);
      await new Promise(resolve => setTimeout(resolve, 1000));
      let end1 = performance.now();
      let start2 = performance.now();
      sharpen (ctx, img.width, img.height, 5);
      await new Promise(resolve => setTimeout(resolve, 1000));
      let end2 = performance.now();
      let duration = (end1 - start1) + (end2 - start2) - 2000;
      document.getElementById("processing-time").innerHTML = `Image processing took ${duration} milliseconds.`;
    }
      console.log(ob.message);
      img.src = ob.message;
  }
  req.open("GET", "https://dog.ceo/api/breeds/image/random");
  req.send();
}