import { useState, useEffect } from 'react';
import { processImage } from '../../lib/imageProcessor';

const FONTS = ['Bogart', 'Cocogoose', 'Heavitas', 'Redband', 'Inter'];

const ROTATIONS = [
    { value: 0, label: '0°' },
    { value: 15, label: '15°' },
    { value: 45, label: '45°' },
];

const TEXT_EFFECTS = [
    { id: 'classic', label: 'Classic', icon: '✨' },
    { id: 'metallic', label: 'Metallic', icon: '🪙' },
    { id: 'neon', label: 'Neon', icon: '💡' },
    { id: 'shadow', label: 'Shadow', icon: '🌑' },
    { id: 'retro3d', label: '3D', icon: '📐' },
    { id: 'glitch', label: 'Glitch', icon: '📺' },
    { id: 'echo', label: 'Echo', icon: '🌊' },
    { id: 'glass', label: 'Glass', icon: '🪟' },
    { id: 'glow', label: 'Glow', icon: '🌟' },
    { id: 'gradient', label: 'Grad', icon: '🌈' },
    { id: 'outline', label: 'Outline', icon: '⭕' },
];

export default function EditorStep({ data, updateOption, updateTitle, onPrev }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image'
    const [activeSubsection, setActiveSubsection] = useState(null); // 'effect' | 'font' | 'position' | null

    useEffect(() => {
        let active = true;
        const generate = async () => {
            setIsProcessing(true);
            try {
                const url = await processImage(data.image, {
                    title: data.options.allCaps ? data.title.toUpperCase() : data.title,
                    color: data.color,
                    contrast: data.options.contrast,
                    brightness: data.options.brightness,
                    dotSize: data.options.dotSize,
                    blackPoint: data.options.blackPoint,
                    whitePoint: data.options.whitePoint,
                    font: data.options.font,
                    textSize: data.options.textSize,
                    textX: data.options.textX,
                    textY: data.options.textY,
                    rotation: data.options.rotation,
                    textEffect: data.options.textEffect,
                    invert: data.options.invert,
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

    const nudgePosition = (dx, dy) => {
        const step = 0.05;
        const newX = Math.max(0, Math.min(1, data.options.textX + dx * step));
        const newY = Math.max(0, Math.min(1, data.options.textY + dy * step));
        updateOption('textX', newX);
        updateOption('textY', newY);
    };

    // Render subsection views
    const renderSubsection = () => {
        if (activeSubsection === 'effect') {
            return (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => setActiveSubsection(null)}
                            style={{
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                background: '#f0f0f0',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            ← Back
                        </button>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Effect</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        flex: 1
                    }}>
                        {TEXT_EFFECTS.map(effect => (
                            <button
                                key={effect.id}
                                onClick={() => {
                                    updateOption('textEffect', effect.id);
                                    setActiveSubsection(null);
                                }}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    background: data.options.textEffect === effect.id ? '#333' : '#f0f0f0',
                                    color: data.options.textEffect === effect.id ? 'white' : '#333',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span style={{ fontSize: '2rem' }}>{effect.icon}</span>
                                <span>{effect.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeSubsection === 'font') {
            return (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => setActiveSubsection(null)}
                            style={{
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                background: '#f0f0f0',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            ← Back
                        </button>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Font</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', flex: 1 }}>
                        {FONTS.map(font => (
                            <button
                                key={font}
                                onClick={() => {
                                    updateOption('font', font);
                                    setActiveSubsection(null);
                                }}
                                style={{
                                    padding: '0.8rem 0.4rem',
                                    borderRadius: '12px',
                                    border: `3px solid ${data.options.font === font ? data.color : '#eee'}`,
                                    background: data.options.font === font ? `${data.color}15` : 'white',
                                    fontFamily: font,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    textAlign: 'center'
                                }}
                            >
                                {font}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeSubsection === 'position') {
            return (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => setActiveSubsection(null)}
                            style={{
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                background: '#f0f0f0',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            ← Back
                        </button>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Position</h2>
                    </div>

                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1rem',
                            maxWidth: '280px'
                        }}>
                            <div></div>
                            <button
                                onClick={() => nudgePosition(0, -1)}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    background: '#f0f0f0',
                                    border: 'none',
                                    fontSize: '2rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ↑
                            </button>
                            <div></div>

                            <button
                                onClick={() => nudgePosition(-1, 0)}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    background: '#f0f0f0',
                                    border: 'none',
                                    fontSize: '2rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ←
                            </button>
                            <button
                                onClick={() => {
                                    updateOption('textX', 0.5);
                                    updateOption('textY', 0.5);
                                }}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    background: '#333',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                title="Reset to center"
                            >
                                ●
                            </button>
                            <button
                                onClick={() => nudgePosition(1, 0)}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    background: '#f0f0f0',
                                    border: 'none',
                                    fontSize: '2rem',
                                    cursor: 'pointer'
                                }}
                            >
                                →
                            </button>

                            <div></div>
                            <button
                                onClick={() => nudgePosition(0, 1)}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    background: '#f0f0f0',
                                    border: 'none',
                                    fontSize: '2rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ↓
                            </button>
                            <div></div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            overflow: 'hidden',
            background: '#fafafa'
        }}>

            {/* Preview Area */}
            <div style={{
                flexShrink: 0,
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '300px',
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
            </div>

            {/* Controls Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                borderRadius: '24px 24px 0 0',
                overflow: 'hidden',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                minHeight: 0
            }}>

                {/* Tabs */}
                {!activeSubsection && (
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', flexShrink: 0 }}>
                        <button
                            onClick={() => setActiveTab('text')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: activeTab === 'text' ? '#fff' : '#fafafa',
                                fontWeight: activeTab === 'text' ? '900' : '600',
                                color: activeTab === 'text' ? data.color : '#888',
                                borderBottom: activeTab === 'text' ? `3px solid ${data.color}` : '3px solid transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Text
                        </button>
                        <button
                            onClick={() => setActiveTab('image')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: activeTab === 'image' ? '#fff' : '#fafafa',
                                fontWeight: activeTab === 'image' ? '900' : '600',
                                color: activeTab === 'image' ? data.color : '#888',
                                borderBottom: activeTab === 'image' ? `3px solid ${data.color}` : '3px solid transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Image
                        </button>
                    </div>
                )}

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                    {activeSubsection ? (
                        renderSubsection()
                    ) : activeTab === 'text' ? (
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Title - Always Visible */}
                            <div>
                                <label style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem' }}>Title</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => updateTitle(e.target.value)}
                                        placeholder="Playlist Title"
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '2px solid #eee',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => updateOption('allCaps', !data.options.allCaps)}
                                        style={{
                                            background: data.options.allCaps ? '#333' : '#f0f0f0',
                                            color: data.options.allCaps ? 'white' : '#333',
                                            padding: '0 1rem',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        title="Toggle ALL CAPS"
                                    >
                                        AA
                                    </button>
                                </div>
                            </div>

                            {/* Size - Always Visible */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <label style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Size</label>
                                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{Math.round(data.options.textSize * 100)}%</span>
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

                            {/* Navigation Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                                <button
                                    onClick={() => setActiveSubsection('effect')}
                                    style={{
                                        padding: '0.85rem 0.4rem',
                                        borderRadius: '12px',
                                        background: '#f0f0f0',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>🎨</span>
                                    <span>Effect</span>
                                </button>
                                <button
                                    onClick={() => setActiveSubsection('font')}
                                    style={{
                                        padding: '1rem 0.5rem',
                                        borderRadius: '12px',
                                        background: '#f0f0f0',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>✍️</span>
                                    <span>Font</span>
                                </button>
                                <button
                                    onClick={() => setActiveSubsection('position')}
                                    style={{
                                        padding: '1rem 0.5rem',
                                        borderRadius: '12px',
                                        background: '#f0f0f0',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>📍</span>
                                    <span>Position</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Adjustments Group */}
                            <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '12px' }}>
                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Adjustments</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <label style={{ fontWeight: 600, color: '#333', fontSize: '0.85rem' }}>Contrast</label>
                                            <span style={{ color: '#888', fontSize: '0.75rem' }}>{data.options.contrast.toFixed(1)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2.0"
                                            step="0.1"
                                            value={data.options.contrast}
                                            onChange={(e) => updateOption('contrast', parseFloat(e.target.value))}
                                            style={{ width: '100%', accentColor: data.color }}
                                            list="contrast-center"
                                        />
                                        <datalist id="contrast-center">
                                            <option value="1.0"></option>
                                        </datalist>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <label style={{ fontWeight: 600, color: '#333', fontSize: '0.85rem' }}>Brightness</label>
                                            <span style={{ color: '#888', fontSize: '0.75rem' }}>{data.options.brightness.toFixed(1)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2.0"
                                            step="0.1"
                                            value={data.options.brightness}
                                            onChange={(e) => updateOption('brightness', parseFloat(e.target.value))}
                                            style={{ width: '100%', accentColor: data.color }}
                                            list="brightness-center"
                                        />
                                        <datalist id="brightness-center">
                                            <option value="1.0"></option>
                                        </datalist>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontWeight: 600, color: '#333', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Black Point</label>
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
                                        <label style={{ fontWeight: 600, color: '#333', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>White Point</label>
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
                            </div>

                            {/* Halftone Group */}
                            <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '12px' }}>
                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Halftone</h3>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontWeight: 600, color: '#333', fontSize: '0.85rem' }}>Dot Size</label>
                                        <span style={{ color: '#888', fontSize: '0.75rem' }}>{data.options.dotSize}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="4"
                                        max="15"
                                        step="1"
                                        value={data.options.dotSize}
                                        onChange={(e) => updateOption('dotSize', parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: data.color }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block', fontSize: '0.85rem' }}>Pattern Rotation</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {ROTATIONS.map(rot => (
                                            <button
                                                key={rot.value}
                                                onClick={() => updateOption('rotation', rot.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.8rem',
                                                    borderRadius: '8px',
                                                    background: data.options.rotation === rot.value ? '#333' : 'white',
                                                    color: data.options.rotation === rot.value ? 'white' : '#333',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold',
                                                    border: data.options.rotation === rot.value ? 'none' : '2px solid #eee',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {rot.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons - Fixed Bottom */}
                {!activeSubsection && (
                    <div style={{
                        padding: '1rem',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '1rem',
                        background: 'white',
                        flexShrink: 0
                    }}>
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
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer'
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
                                color: '#fff',
                                padding: '1rem',
                                borderRadius: '50px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: `0 4px 15px ${data.color}80`,
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Download
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
