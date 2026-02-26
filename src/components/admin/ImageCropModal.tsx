import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropModalProps {
    imageUrl: string;
    aspect?: number;
    onConfirm: (croppedBlob: Blob) => void;
    onCancel: () => void;
}

export function ImageCropModal({
    imageUrl,
    aspect = 4 / 5,
    onConfirm,
    onCancel,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);

        try {
            const blob = await getCroppedImage(imageUrl, croppedAreaPixels);
            onConfirm(blob);
        } catch {
            onCancel();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white">Crop Image</h3>
                    <button
                        onClick={onCancel}
                        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Cancel crop"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Crop Area */}
                <div className="relative h-80 bg-slate-950">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        cropShape="rect"
                        showGrid={true}
                        style={{
                            containerStyle: { borderRadius: 0 },
                        }}
                    />
                </div>

                {/* Zoom Control */}
                <div className="flex items-center gap-4 px-6 py-4 border-t border-slate-800">
                    <ZoomOut className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg
                            [&::-webkit-slider-thumb]:cursor-pointer"
                        aria-label="Zoom level"
                    />
                    <ZoomIn className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-xs text-slate-500 tabular-nums w-10 text-right">
                        {Math.round(zoom * 100)}%
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 py-4 border-t border-slate-800">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors"
                    >
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        {isProcessing ? 'Processing...' : 'Apply Crop'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Canvas-based crop extraction ────────────────
async function getCroppedImage(
    imageSrc: string,
    pixelCrop: Area,
    maxWidth = 1200,
    quality = 0.85
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context failed');

    // Determine output size (respect maxWidth)
    let outputWidth = pixelCrop.width;
    let outputHeight = pixelCrop.height;

    if (outputWidth > maxWidth) {
        outputHeight = (outputHeight * maxWidth) / outputWidth;
        outputWidth = maxWidth;
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas toBlob failed'));
            },
            'image/webp',
            quality
        );
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
