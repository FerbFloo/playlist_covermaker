import { useState, useEffect } from 'react';
import { processImage } from '../../lib/imageProcessor';

const FONTS = ['Bogart', 'Cocogoose', 'Heavitas', 'Redband', 'Inter'];

export default function EditorStep({ data, updateOption, onPrev }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        let active = true;
        const generate = async () => {
            setIsProcessing(true);
            try {
                const url = await processImage(data.image, {
                    title: data.title,
                    color: data.color,
                    contrast: data.options.contrast,
                    dotSize: data.options.dotSize,
                    blackPoint: data.options.blackPoint,
                    whitePoint: data.options.whitePoint,
                    font: data.options.font,
                    textSize: data.options.textSize,
                    width: 1080,
                    height: 1080
                });
                if (active) setPreviewUrl(url);
            } catch (err) {
                console.error(err);
            } finally {
                if (active) setIsProcessing(false);
            }
        };

        // Debounce slightly to prevent lag on slider drag
        const timer = setTimeout(generate, 100);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [data]);

    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.download = `${data.title.replace(/\s+/g, '-').toLowerCase()}-cover.jpg`;
        link.href = previewUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="step-container" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            alignItems: 'center',
            paddingBottom: '5rem' /* Space for scrolling */
        }}>
            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Preview Area */}
                <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    position: 'relative',
                    backgroundColor: '#eee'
                }}>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', display: 'block' }}
                        />
                    )}
                    {isProcessing && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(2px)'
                        }}>
                            Updating...
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Font Selection */}
                    <div>
                        <label style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>Font</label>
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {FONTS.map(font => (
                                <button
                                    key={font}
                                    onClick={() => updateOption('font', font)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: `2px solid ${data.options.font === font ? data.color : '#eee'}`,
                                        background: data.options.font === font ? `${data.color}10` : 'white',
                                        fontFamily: font,
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Size */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, color: '#333' }}>Text Size</label>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>{Math.round(data.options.textSize * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={data.options.textSize}
                            onChange={(e) => updateOption('textSize', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: data.color }}
                        />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

                    {/* Levels (Black Point / White Point) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>Black Point</label>
                            <input
                                type="range"
                                min="0.0"
                                max="0.5"
                                step="0.05"
                                value={data.options.blackPoint}
                                onChange={(e) => updateOption('blackPoint', parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#333' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>White Point</label>
                            <input
                                type="range"
                                min="0.5"
                                max="1.0"
                                step="0.05"
                                value={data.options.whitePoint}
                                onChange={(e) => updateOption('whitePoint', parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#333' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, color: '#333' }}>Contrast</label>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>{Math.round(data.options.contrast * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={data.options.contrast}
                            onChange={(e) => updateOption('contrast', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: data.color }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, color: '#333' }}>Dot Size</label>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>{data.options.dotSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="24"
                            step="1"
                            value={data.options.dotSize}
                            onChange={(e) => updateOption('dotSize', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: data.color }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onPrev}
                            style={{
                                flex: 1,
                                background: '#f0f0f0',
                                color: '#333',
                                padding: '1rem',
                                borderRadius: '50px',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleDownload}
                            style={{
                                flex: 2,
                                background: data.color,
                                color: '#fff', // Ideally contrast calc
                                padding: '1rem',
                                borderRadius: '50px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: `0 4px 15px ${data.color}80`
                            }}
                        >
                            Download Cover
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
