import { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isAnalyzing: boolean;
}

export default function UploadZone({ onFilesSelected, isAnalyzing }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      setError('Please upload PDF files only');
      return;
    }
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      setError('Please upload PDF files only');
      return;
    }
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
    e.target.value = '';
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
      setSelectedFiles([]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver ? '' : 'hover:border-white/[0.08]'
        }`}
        style={isDragOver ? {
          background: 'rgba(59, 130, 246, 0.04)',
          border: '1px dashed rgba(59, 130, 246, 0.4)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.08), inset 0 0 30px rgba(59, 130, 246, 0.02)',
        } : {
          background: 'rgba(14, 18, 37, 0.3)',
          border: '1px dashed rgba(255, 255, 255, 0.06)',
        }}
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isAnalyzing}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isDragOver ? 'scale-110' : ''
          }`}
            style={isDragOver ? {
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)',
            } : {
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <Upload className={`w-5 h-5 transition-colors duration-200 ${isDragOver ? 'text-blue-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-300">
              {isDragOver ? 'Drop files here' : 'Drop PDF resumes or click to browse'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">Supports multiple PDF files</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-[12px] px-3.5 py-2.5 rounded-lg animate-fade-in"
          style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)' }}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2.5 animate-fade-in">
          <p className="section-label">Selected ({selectedFiles.length})</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 animate-slide-in-right"
                style={{ background: 'rgba(14, 18, 37, 0.4)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.1)' }}
                >
                  <File className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-[12px] text-slate-300 truncate flex-1">{file.name}</span>
                <span className="text-[10px] text-slate-600 flex-shrink-0 tabular-nums">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <button
                  onClick={() => removeFile(i)}
                  className="text-slate-600 hover:text-red-400 transition-colors"
                  disabled={isAnalyzing}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary w-full"
          >
            {isAnalyzing ? 'Analyzing...' : `Analyze ${selectedFiles.length} Resume${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}
