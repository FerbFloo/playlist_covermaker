export async function processImage(imageSrc, options) {
    console.log("processImage called with options:", options);
    const {
        title,
        color,
        contrast = 1.0,
        brightness = 1.0,
        dotSize = 8,
        blackPoint = 0.0,
        whitePoint = 1.0,
        font = 'Heavitas',
        textSize = 1.0,
        textX = 0.5,
        textY = 0.5,
        rotation = 0,
        textEffect = 'classic',
        invert = false,
        width = 1080,
        height = 1080,
    } = options;

    // 1. Pre-load Font
    const fontString = `900 100px "${font}"`;
    try {
        await document.fonts.load(fontString);
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
                drawHalftoneLayer(ctx, img, { width, height, color, contrast, brightness, dotSize, blackPoint, whitePoint, rotation, invert });

                // --- LAYER 2: Text ---
                if (title) {
                    drawTextLayer(ctx, title, { width, height, font, textSize, color, textX, textY, textEffect });
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

function drawHalftoneLayer(ctx, img, { width, height, color, contrast, brightness, dotSize, blackPoint, whitePoint, rotation, invert }) {
    // 1. Fill Paper (Background)
    const paperColor = invert ? color : '#FFFFFF';
    const dotColor = invert ? '#FFFFFF' : color;
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

    // 3. Draw Dots with Rotation (ONLY the dot pattern rotates, not the sampling)
    ctx.fillStyle = dotColor;
    const grid = Math.max(4, dotSize);
    const rotRad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rotRad);
    const sin = Math.sin(rotRad);
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate bounds to cover entire canvas when rotated
    const diag = Math.sqrt(width * width + height * height);
    const start = -diag / 2;
    const end = diag / 2;

    for (let gy = start; gy < end; gy += grid) {
        for (let gx = start; gx < end; gx += grid) {
            // (gx, gy) is the coordinate in our rotated grid sheet (centered at origin)
            // Transform to final canvas coordinates
            const canvasX = gx * cos - gy * sin + centerX;
            const canvasY = gx * sin + gy * cos + centerY;

            // Sample from the physical coordinate on the canvas
            if (canvasX >= 0 && canvasX < width && canvasY >= 0 && canvasY < height) {
                const sampleX = Math.floor(canvasX);
                const sampleY = Math.floor(canvasY);
                const i = (sampleY * width + sampleX) * 4;

                if (i < data.length) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Grayscale
                    let bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                    // Adjustments
                    bright = bright * brightness;
                    bright = (bright - 0.5) * contrast + 0.5;

                    if (whitePoint > blackPoint) {
                        bright = (bright - blackPoint) / (whitePoint - blackPoint);
                    }

                    bright = Math.max(0, Math.min(1, bright));

                    // Radius (Darker = Larger)
                    const radius = (1 - bright) * (grid / 1.6);

                    if (radius > 0.5) {
                        ctx.beginPath();
                        ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
    }
}

function drawTextLayer(ctx, title, { width, height, font, textSize, color, textX, textY, textEffect }) {
    ctx.save();

    // Convert 0-1 coordinates to pixel positions
    const x = textX * width;
    const y = textY * height;

    ctx.translate(x, y);

    let baseSize = 180 * textSize;
    let fontStr = `900 ${baseSize}px "${font}", "Inter", sans-serif`;

    ctx.font = fontStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure to prevent overflow
    const mw = width * 0.9;
    let iterations = 0;
    while (ctx.measureText(title).width > mw && iterations < 50) {
        baseSize *= 0.95;
        fontStr = `900 ${baseSize}px "${font}", "Inter", sans-serif`;
        ctx.font = fontStr;
        iterations++;
    }

    // Apply text effect
    switch (textEffect) {
        case 'classic':
            // White outline + color fill (original)
            ctx.lineWidth = baseSize * 0.06;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineJoin = 'round';
            ctx.miterLimit = 3;
            ctx.strokeText(title, 0, 0);
            ctx.fillStyle = color;
            ctx.fillText(title, 0, 0);
            break;

        case 'metallic':
            // 3D Metallic Effect
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.shadowBlur = baseSize * 0.15;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(title, 0, 0);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowOffsetX = baseSize * 0.04;
            ctx.shadowOffsetY = baseSize * 0.04;
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText(title, 0, 0);
            ctx.shadowColor = 'transparent';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            const metalGradient = ctx.createLinearGradient(0, -baseSize / 1.8, 0, baseSize / 1.8);
            metalGradient.addColorStop(0, '#c8c8c8');
            metalGradient.addColorStop(0.25, '#f0f0f0');
            metalGradient.addColorStop(0.45, '#ffffff');
            metalGradient.addColorStop(0.65, '#e0e0e0');
            metalGradient.addColorStop(1, '#a0a0a0');
            ctx.fillStyle = metalGradient;
            ctx.fillText(title, 0, 0);
            break;

        case 'neon':
            // Neon glow effect
            ctx.shadowColor = color;
            ctx.shadowBlur = baseSize * 0.15;
            ctx.lineWidth = baseSize * 0.03;
            ctx.strokeStyle = color;
            ctx.strokeText(title, 0, 0);
            ctx.shadowBlur = baseSize * 0.3;
            ctx.strokeText(title, 0, 0);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(title, 0, 0);
            break;

        case 'echo':
            // Echo / Motion Blur Effect
            const echoSteps = 6;
            const echoOffset = baseSize * 0.015;
            for (let i = echoSteps; i > 0; i--) {
                ctx.fillStyle = `${color}${Math.floor((1 - i / echoSteps) * 40).toString(16).padStart(2, '0')}`;
                ctx.fillText(title, i * echoOffset, i * echoOffset);
            }
            ctx.fillStyle = '#ffffff';
            ctx.fillText(title, 0, 0);
            break;

        case 'glow':
            // Soft Aura/Glow effect
            ctx.shadowColor = color;
            ctx.shadowBlur = baseSize * 0.4;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(title, 0, 0);
            ctx.shadowBlur = baseSize * 0.1;
            ctx.fillText(title, 0, 0);
            break;

        case 'shadow':
            // Bold drop shadow
            const shadowOffset = baseSize * 0.05;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillText(title, shadowOffset, shadowOffset);
            ctx.lineWidth = baseSize * 0.04;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineJoin = 'round';
            ctx.strokeText(title, 0, 0);
            ctx.fillStyle = color;
            ctx.fillText(title, 0, 0);
            break;

        case 'retro3d':
            // Retro 3D layered effect
            const offset3d = baseSize * 0.015;
            const layers = 12;
            ctx.shadowBlur = baseSize * 0.02;
            for (let i = layers; i > 0; i--) {
                const alpha = 0.25 - (i / layers) * 0.15;
                ctx.fillStyle = `rgba(0,0,0,${alpha})`;
                ctx.shadowColor = `rgba(0,0,0,${alpha * 0.5})`;
                ctx.fillText(title, offset3d * i, offset3d * i);
            }
            ctx.shadowBlur = 0;
            ctx.lineWidth = baseSize * 0.05;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineJoin = 'round';
            ctx.strokeText(title, 0, 0);
            ctx.fillStyle = color;
            ctx.fillText(title, 0, 0);
            break;

        case 'outline':
            // Outline only
            ctx.lineWidth = baseSize * 0.05;
            ctx.strokeStyle = color;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 3;
            ctx.strokeText(title, 0, 0);
            break;

        case 'gradient':
            // Solid color top, subtly lighter bottom
            ctx.fillStyle = color;
            ctx.fillText(title, 0, 0);

            ctx.globalCompositeOperation = 'source-atop';
            const grad = ctx.createLinearGradient(0, -baseSize / 2, 0, baseSize / 2);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.35)');
            ctx.fillStyle = grad;
            ctx.fillText(title, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            break;

        default:
            // Fallback to classic
            ctx.lineWidth = baseSize * 0.06;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineJoin = 'round';
            ctx.miterLimit = 3;
            ctx.strokeText(title, 0, 0);
            ctx.fillStyle = color;
            ctx.fillText(title, 0, 0);
            break;
    }

    ctx.restore();
}
