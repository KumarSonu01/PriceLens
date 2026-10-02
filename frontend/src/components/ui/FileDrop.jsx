import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const FileDrop = ({
  preview,
  onFileSelect,
  onRemove,
  loading = false,
  circular = false,
  accept = "image/*",
  label = "Upload file",
  hint = "PNG, JPG or WEBP (up to 5MB)",
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect && onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect && onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block group">
          <div
            className={cn(
              "overflow-hidden border border-line bg-surface-2 flex items-center justify-center shadow-sm",
              circular ? "w-28 h-28 rounded-full" : "w-full max-w-sm h-48 rounded-lg"
            )}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-signal">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="text-xs font-semibold text-text hover:text-signal transition-colors underline cursor-pointer"
            >
              Change
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                disabled={loading}
                className="text-xs font-semibold text-rise hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
            isDragging
              ? "border-signal bg-signal/5"
              : "border-line bg-surface hover:border-text/30 hover:bg-surface-2",
            circular ? "w-28 h-28 rounded-full p-2" : "w-full"
          )}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 text-signal animate-spin" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center text-muted mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-text">{label}</p>
              {!circular && <p className="text-[11px] text-muted mt-1">{hint}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDrop;
