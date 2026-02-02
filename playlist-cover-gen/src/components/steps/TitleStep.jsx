import { useEffect, useRef } from 'react';

export default function TitleStep({ title, onChange, onNext }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) onNext();
    };

    return (
        <div className="step-container" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <label
                        htmlFor="playlist-title"
                        style={{
                            display: 'block',
                            marginBottom: '1rem',
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            opacity: 0.8
                        }}
                    >
                        Name your playlist
                    </label>
                    <input
                        ref={inputRef}
                        id="playlist-title"
                        type="text"
                        value={title}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="My Awesome Mix"
                        style={{
                            width: '100%',
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            textAlign: 'center',
                            border: 'none',
                            borderBottom: '2px solid rgba(0,0,0,0.1)',
                            background: 'transparent',
                            padding: '0.5rem',
                            outline: 'none',
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!title.trim()}
                    style={{
                        background: 'var(--primary-color)',
                        color: 'var(--secondary-color)',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        alignSelf: 'center',
                        opacity: title.trim() ? 1 : 0.5,
                        transition: 'opacity 0.2s',
                        marginTop: 'auto'
                    }}
                >
                    Next
                </button>
            </form>
        </div>
    );
}
