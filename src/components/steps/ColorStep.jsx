import { HexColorPicker } from 'react-colorful';

// Modern, curated presets
const PRESETS = [
    '#1DB954', // Spotify Green
    '#FF6B6B', // Vibrant Red
    '#4ECDC4', // Teal
    '#FFE66D', // Bright Yellow
    '#FF0055', // Neon Pink
    '#0055FF', // Electric Blue
    '#7F00FF', // Violet
    '#FF9F1C', // Orange
    '#F7F7F7', // White-ish
    '#111111', // Black-ish
];

export default function ColorStep({ color, onChange, onNext, onPrev }) {
    return (
        <div className="step-container" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100dvh',
            overflow: 'hidden',
            background: '#fafafa'
        }}>
            {/* Header */}
            <div style={{
                width: '100%',
                padding: '2rem 1.5rem 1rem',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    margin: 0
                }}>
                    Choose a Vibe
                </h2>
            </div>

            {/* Scrollable Content */}
            <div style={{
                flex: 1,
                width: '100%',
                maxWidth: '500px',
                overflowY: 'auto',
                padding: '0 1.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center'
            }}>
                {/* Color Wheel */}
                <div style={{
                    width: '100%',
                    maxWidth: '300px'
                }}>
                    <div className="custom-color-picker">
                        <HexColorPicker
                            color={color}
                            onChange={onChange}
                        />
                    </div>
                </div>

                {/* Color Display */}
                <div style={{
                    background: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '16px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <span style={{
                        width: '24px',
                        height: '24px',
                        background: color,
                        borderRadius: '6px',
                        border: '2px solid rgba(0,0,0,0.1)',
                        flexShrink: 0
                    }} />
                    {color.toUpperCase()}
                </div>

                {/* Presets */}
                <div style={{ width: '100%' }}>
                    <label style={{
                        display: 'block',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        Quick Picks
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '1rem',
                        justifyItems: 'center'
                    }}>
                        {PRESETS.map(preset => (
                            <button
                                key={preset}
                                onClick={() => onChange(preset)}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: preset,
                                    border: color.toLowerCase() === preset.toLowerCase()
                                        ? '3px solid #000'
                                        : '2px solid rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    transform: color.toLowerCase() === preset.toLowerCase()
                                        ? 'scale(1.1)'
                                        : 'scale(1)',
                                    boxShadow: color.toLowerCase() === preset.toLowerCase()
                                        ? '0 4px 12px rgba(0,0,0,0.2)'
                                        : '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                aria-label={`Select color ${preset}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation - Fixed Bottom */}
            <div style={{
                width: '100%',
                padding: '1.5rem',
                background: 'white',
                borderTop: '1px solid #eee',
                display: 'flex',
                gap: '1rem',
                maxWidth: '600px',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
                <button
                    onClick={onPrev}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '50px',
                        border: 'none',
                        background: '#f0f0f0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#333',
                        cursor: 'pointer'
                    }}
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    style={{
                        flex: 2,
                        padding: '1rem',
                        borderRadius: '50px',
                        border: 'none',
                        background: color,
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#fff',
                        cursor: 'pointer',
                        boxShadow: `0 4px 12px ${color}40`
                    }}
                >
                    Continue
                </button>
            </div>

            <style>{`
                .custom-color-picker .react-colorful {
                    width: 100%;
                    height: 280px;
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                }
                .custom-color-picker .react-colorful__saturation {
                    border-radius: 20px 20px 0 0;
                    border-bottom: none;
                }
                .custom-color-picker .react-colorful__hue {
                    height: 40px;
                    border-radius: 0 0 20px 20px;
                    margin-top: 0;
                }
                .custom-color-picker .react-colorful__pointer {
                    width: 28px;
                    height: 28px;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                .custom-color-picker .react-colorful__hue-pointer {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
}
