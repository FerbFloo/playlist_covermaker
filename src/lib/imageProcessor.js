export async function processImage(imageSrc, options) {
    console.log("processImage called with options:", options);
    const {
        title,
        color,
        contrast = 1.0,
        dotSize = 8,
        blackPoint = 0.0,
        whitePoint = 1.0,
        font = 'Heavitas',
        textSize = 1.0,
        width = 1080,
        height = 1080,
    } = options;

    // 1. Pre-load Font
    // We explicitly try to verify the font is ready before converting to pixels
    const fontString = `900 100px "${font}"`;
    try {
        console.log(`Attempting to load font: ${fontString}`);
        const loaded = await document.fonts.load(fontString);
        console.log(`Font load result: ${loaded.length > 0 ? 'Loaded' : 'Not Loaded (might already be active)'}`);
    } catch (e) {
        console.warn('Font checking error:', e);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // --- LAYER 1: Background & Halftone ---
                drawHalftoneLayer(ctx, img, { width, height, color, contrast, dotSize, blackPoint, whitePoint });

                // --- LAYER 2: Text ---
                if (title) {
                    drawTextLayer(ctx, title, { width, height, font, textSize, color });
                }

                resolve(canvas.toDataURL('image/jpeg', 0.9));
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = (e) => {
            console.error("Image load failed", e);
            reject(e);
        };
    });
}

function drawHalftoneLayer(ctx, img, { width, height, color, contrast, dotSize, blackPoint, whitePoint }) {
    // 1. Fill Paper (Background)
    const paperColor = '#FFFFFF';
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Offscreen processing to get pixel data
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');

    // "Cover" fit logic
    const scale = Math.max(width / img.width, height / img.height);
    const x = (width - img.width * scale) / 2;
    const y = (height - img.height * scale) / 2;
    offCtx.drawImage(img, x, y, img.width * scale, img.height * scale);

    const imageData = offCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 3. Draw Dots
    ctx.fillStyle = color;
    const grid = Math.max(4, dotSize);

    for (let y = 0; y < height; y += grid) {
        for (let x = 0; x < width; x += grid) {
            const i = ((y + Math.floor(grid / 2)) * width + (x + Math.floor(grid / 2))) * 4;

            if (i < data.length) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Grayscale
                let bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                // Contrast
                bright = (bright - 0.5) * contrast + 0.5;

                // Levels
                if (whitePoint > blackPoint) {
                    bright = (bright - blackPoint) / (whitePoint - blackPoint);
                }

                // Clamp
                bright = Math.max(0, Math.min(1, bright));

                // Radius (Darker = Larger)
                const radius = (1 - bright) * (grid / 1.6);

                if (radius > 0.5) {
                    ctx.beginPath();
                    ctx.arc(x + grid / 2, y + grid / 2, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
}

function drawTextLayer(ctx, title, { width, height, font, textSize, color }) {
    console.log(`Drawing Text: "${title}" | Font: ${font} | Size Multiplier: ${textSize}`);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    /* 
       Dynamic Font Sizing Strategy:
       1. Base Size: 180px (Big!)
       2. Multiplier: User Slider (0.5 - 2.0)
       3. Constraint: Max Width of 90% canvas
    */

    let baseSize = 180 * textSize;
    // Enforce a font string that definitely works
    let fontStr = `900 ${baseSize}px "${font}", "Inter", sans-serif`;

    ctx.font = fontStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure and Shrink if overflow
    const mw = width * 0.9;
    let iterations = 0;
    while (ctx.measureText(title).width > mw && iterations < 50) {
        baseSize *= 0.95; // Shrink by 5%
        fontStr = `900 ${baseSize}px "${font}", "Inter", sans-serif`;
        ctx.font = fontStr;
        iterations++;
    }

    console.log(`Final Font String: ${ctx.font}`);

    // Paper Outline (Stroke) to separate text from dots
    ctx.lineWidth = baseSize * 0.06;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 3;
    ctx.strokeText(title, 0, 0);

    // Ink Fill
    ctx.fillStyle = color;
    ctx.fillText(title, 0, 0);

    ctx.restore();
}
