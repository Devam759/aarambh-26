const { GifUtil, GifFrame } = require('gifwrap');
const Jimp = require('jimp');

async function removeBackground() {
  const gif = await GifUtil.read('public/walk-mario-sticker-walk-mario-paper-mario-discover-and-share.gif');
  
  const modifiedFrames = [];
  
  for (const frame of gif.frames) {
    const jimpImage = GifUtil.copyAsJimp(Jimp, frame);
    
    jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, function(x, y, idx) {
      const red   = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue  = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];
      
      // If color is close to white (threshold), make it transparent
      if (red > 230 && green > 230 && blue > 230 && alpha > 0) {
        this.bitmap.data[idx + 3] = 0; // Set Alpha to 0
      }
    });
    
    const newFrame = new GifFrame(jimpImage.bitmap);
    
    // Preserve frame metadata
    newFrame.xOffset = frame.xOffset;
    newFrame.yOffset = frame.yOffset;
    newFrame.delayCentisecs = frame.delayCentisecs;
    newFrame.disposalMethod = 2; // Dispose to background to prevent ghosting
    
    // Quantize the colors
    GifUtil.quantizeDekker(newFrame, 255);
    
    modifiedFrames.push(newFrame);
  }
  
  await GifUtil.write('public/mario-transparent.gif', modifiedFrames);
  console.log('Background removed successfully!');
}

removeBackground().catch(console.error);
