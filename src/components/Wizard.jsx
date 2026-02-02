import { useState } from 'react';
import TitleStep from './steps/TitleStep';
import ColorStep from './steps/ColorStep';
import ImageStep from './steps/ImageStep';
import EditorStep from './steps/EditorStep';

export default function Wizard() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        title: '',
        color: '#1DB954', // Default Spotify Green
        image: null,
        options: {
            contrast: 1.0,
            dotSize: 1.0,
            blackPoint: 0.0,
            whitePoint: 1.0,
            font: 'Heavitas',
            textSize: 1.0,
        }
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateData = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="wizard-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {step === 1 && (
                <TitleStep
                    title={data.title}
                    onChange={(t) => updateData('title', t)}
                    onNext={nextStep}
                />
            )}
            {/* Placeholders for future steps */}
            {step === 2 && (
                <ColorStep
                    color={data.color}
                    onChange={(c) => updateData('color', c)}
                    onNext={nextStep}
                    onPrev={prevStep}
                />
            )}
            {step === 3 && (
                <ImageStep
                    image={data.image}
                    onChange={(img) => updateData('image', img)}
                    onNext={nextStep}
                    onPrev={prevStep}
                />
            )}
            {step === 4 && (
                <EditorStep
                    data={data}
                    updateOption={(key, val) =>
                        setData(prev => ({ ...prev, options: { ...prev.options, [key]: val } }))
                    }
                    onPrev={prevStep}
                />
            )}
        </div>
    );
}
