import { useState } from 'react';

const PRESETS = [
    '#1DB954', // Spotify Green
    '#FF0055', // Hot Pink
    '#0099FF', // Electric Blue
    '#FF5500', // Sunset Orange
    '#9D00FF', // Deep Purple
    '#FFFF00', // Electric Yellow
    '#000000', // Pitch Black
    '#FFFFFF', // White
];

export default function ColorStep({ color, onChange, onNext, onPrev }) {
    return (
        <div className="step-container" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            backgroundColor: color, /* Live preview background */
            transition: 'background-color 0.3s ease',
            color: getContrastColor(color)
        }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 800, fontSize: '2rem' }}>Pick a Vibe</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => onChange(preset)}
                            style={{
                                backgroundColor: preset,
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '50%',
                                border: color === preset ? `4px solid ${getContrastColor(color)}` : '2px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transform: color === preset ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.2s'
                            }}
                            aria-label={`Select color ${preset}`}
                        />
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                    <label htmlFor="custom-color" style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.8 }}>Custom Color</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            id="custom-color"
                            type="color"
                            value={color}
                            onChange={(e) => onChange(e.target.value)}
                            style={{
                                border: 'none',
                                height: '50px',
                                width: '50px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background: 'none'
                            }}
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => onChange(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'rgba(255,255,255,0.2)',
                                color: 'currentColor',
                                backdropFilter: 'blur(10px)',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    <button
                        type="button"
                        onClick={onPrev}
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.2)',
                            color: 'currentColor',
                            padding: '1rem',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        style={{
                            flex: 1,
                            background: getContrastColor(color),
                            color: color,
                            padding: '1rem',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            border: '2px solid transparent'
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper to determine text color (black or white) based on background brightness
function getContrastColor(hex) {
    if (!hex) return '#000000';
    // Convert hex to RGB
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    // Calculate luminance
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}
