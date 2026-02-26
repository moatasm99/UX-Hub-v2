import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
    currentUrl: string;
    onUploadComplete: (url: string) => void;
    bucket?: string;
}

export function ImageUploader({
    currentUrl,
    onUploadComplete,
    bucket = 'hero-images',
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayUrl = preview || currentUrl;

    const compressImage = async (file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context failed'));

                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Compression failed'));
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    };

    const uploadFile = useCallback(async (file: File) => {
        setError(null);

        // Validate type
        const allowed = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowed.includes(file.type)) {
            setError('Only PNG, JPEG, and WebP images are allowed.');
            return;
        }

        // Validate size (5MB raw)
        if (file.size > 10 * 1024 * 1024) {
            setError('File too large. Maximum 10MB before compression.');
            return;
        }

        // Show instant preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setIsUploading(true);

        try {
            // Compress to WebP
            const compressed = await compressImage(file);

            const filename = `hero-${Date.now()}.webp`;
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filename, compressed, {
                    contentType: 'image/webp',
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filename);

            onUploadComplete(urlData.publicUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    }, [bucket, onUploadComplete]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
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
        if (file) uploadFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onUploadComplete('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400 mb-2">
                Hero Image
            </label>

            {/* Preview */}
            {displayUrl && (
                <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                        src={displayUrl}
                        alt="Hero preview"
                        className="w-full h-48 object-cover"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                    {!isUploading && (
                        <button
                            onClick={handleRemove}
                            className="absolute top-3 right-3 p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            <X className="w-4 h-4" />
                        </button>
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
                                PNG, JPEG, WebP • Max 5MB • Auto-compressed to WebP
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
    );
}
