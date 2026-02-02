import { useRef, useState } from 'react';

export default function ImageStep({ image, onChange, onNext, onPrev }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onChange(e.target.result); // Pass base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="step-container" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem' }}>Select a Photo</h2>

                <div
                    className="upload-area"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '24px',
                        border: `2px dashed ${dragActive ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: dragActive ? 'rgba(0,0,0,0.05)' : 'transparent',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />

                    {image ? (
                        <img
                            src={image}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <>
                            <span style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>📷</span>
                            <p style={{ fontWeight: 600, opacity: 0.6 }}>Tap to upload</p>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    <button
                        type="button"
                        onClick={onPrev}
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.05)',
                            color: 'var(--primary-color)',
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
                        onClick={onNext}
                        disabled={!image}
                        style={{
                            flex: 1,
                            background: 'var(--primary-color)',
                            color: 'var(--secondary-color)',
                            padding: '1rem',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            opacity: image ? 1 : 0.5,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
