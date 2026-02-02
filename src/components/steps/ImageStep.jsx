import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../lib/cropUtils';

export default function ImageStep({ image, KW, onChange, onNext, onPrev }) {
    const [isDragging, setIsDragging] = useState(false);

    // Crop State
    const [tempImage, setTempImage] = useState(null); // The raw uploaded image
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const processCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
            onChange(croppedImage); // Save final cropped image
            onNext(); // Move to next step
        } catch (e) {
            console.error(e);
        }
    };

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTempImage(e.target.result);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // If we have a tempImage, we show the Cropper
    if (tempImage) {
        return (
            <div className="step-container" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{ flex: 1, position: 'relative', background: '#333' }}>
                    <Cropper
                        image={tempImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        showGrid={false}
                    />
                </div>

                <div style={{
                    padding: '1.5rem',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    zIndex: 10
                }}>
                    <div>
                        <label style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'black' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setTempImage(null)}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '50px',
                                background: '#f0f0f0',
                                color: '#333',
                                fontWeight: 'bold'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={processCrop}
                            style={{
                                flex: 2,
                                padding: '1rem',
                                borderRadius: '50px',
                                background: '#000',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            Use Photo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default Upload View
    return (
        <div className="step-container" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            height: '100%'
        }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>Pick a Photo</h2>

            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    aspectRatio: '1',
                    borderRadius: '24px',
                    border: '3px dashed #ddd',
                    background: isDragging ? '#f0f0f0' : '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                {image ? (
                    <img
                        src={image}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <>
                        <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</span>
                        <p style={{ fontWeight: 600, color: '#888' }}>Tap to upload</p>
                    </>
                )}

                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
                <button
                    onClick={onPrev}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        background: '#f0f0f0',
                        color: '#333'
                    }}
                >
                    Back
                </button>
                {image && (
                    <button
                        onClick={onNext}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            background: '#000',
                            color: 'white'
                        }}
                    >
                        Skip
                    </button>
                )}
            </div>
        </div>
    );
}
