import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, Crop } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ImageCropModal } from './ImageCropModal';

interface ImageUploaderProps {
    currentUrl: string;
    onUploadComplete: (url: string) => void;
    bucket?: string;
    aspect?: number;
}

export function ImageUploader({
    currentUrl,
    onUploadComplete,
    bucket = 'hero-images',
    aspect = 4 / 5,
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Crop modal state
    const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayUrl = preview || currentUrl;

    // ─── Step 1: File selected → open crop modal ───
    const handleFileSelected = useCallback((file: File) => {
        setError(null);

        const allowed = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowed.includes(file.type)) {
            setError('Only PNG, JPEG, and WebP images are allowed.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('File too large. Maximum 10MB.');
            return;
        }

        const url = URL.createObjectURL(file);
        setCropImageUrl(url);
        setShowCropModal(true);
    }, []);

    // ─── Step 2: Crop confirmed → upload cropped blob ───
    const handleCropConfirm = useCallback(async (croppedBlob: Blob) => {
        setShowCropModal(false);

        // Show instant preview from the cropped blob
        const previewUrl = URL.createObjectURL(croppedBlob);
        setPreview(previewUrl);
        setIsUploading(true);
        setError(null);

        try {
            const filename = `hero-${Date.now()}.webp`;
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filename, croppedBlob, {
                    contentType: 'image/webp',
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            // Get public URL with cache-busting version param
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filename);

            const versionedUrl = `${urlData.publicUrl}?v=${Date.now()}`;
            onUploadComplete(versionedUrl);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            console.error('Image upload error:', err);
            setError(message);
            setPreview(null);
        } finally {
            setIsUploading(false);
            // Cleanup crop URL
            if (cropImageUrl) URL.revokeObjectURL(cropImageUrl);
            setCropImageUrl(null);
        }
    }, [bucket, onUploadComplete, cropImageUrl]);

    const handleCropCancel = useCallback(() => {
        setShowCropModal(false);
        if (cropImageUrl) URL.revokeObjectURL(cropImageUrl);
        setCropImageUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [cropImageUrl]);

    // ─── Event handlers ───
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelected(file);
        // Reset so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelected(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onUploadComplete('');
    };

    return (
        <>
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    Hero Image
                </label>

                {/* Preview */}
                {displayUrl && (
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                        <img
                            key={displayUrl}
                            src={displayUrl}
                            alt="Hero preview"
                            className="w-full max-h-80 object-contain rounded-xl"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    <p className="text-sm text-white/80">Uploading...</p>
                                </div>
                            </div>
                        )}
                        {!isUploading && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-3 transition-all rounded-2xl">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                                >
                                    <Crop className="w-4 h-4" />
                                    Replace & Crop
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Drop Zone */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
                    className={`
                        relative flex flex-col items-center justify-center gap-3 p-8
                        border-2 border-dashed rounded-2xl cursor-pointer
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50
                        ${isDragOver
                            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-950/50 hover:bg-slate-950'
                        }
                        ${isUploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                    aria-label="Drop image here or click to browse"
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    ) : (
                        <>
                            <div className="p-3 rounded-xl bg-slate-800">
                                {isDragOver ? (
                                    <Upload className="w-6 h-6 text-blue-400" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-slate-500" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-300">
                                    {isDragOver ? 'Drop to upload' : 'Drag & drop or click to browse'}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                    PNG, JPEG, WebP • Max 10MB • Auto-cropped & compressed
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-hidden="true"
                />

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-400 font-medium">❌ {error}</p>
                )}
            </div>

            {/* Crop Modal */}
            {showCropModal && cropImageUrl && (
                <ImageCropModal
                    imageUrl={cropImageUrl}
                    aspect={aspect}
                    onConfirm={handleCropConfirm}
                    onCancel={handleCropCancel}
                />
            )}
        </>
    );
}
