import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setExtractedProfile,
  setStatusCollect,
} from "../../store/slices/sessionSlice";
import { parseResumeFile } from "../../utils/parseResume";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function ResumeUploader() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  async function handleFile(file) {
    setError("");
    setBusy(true);
    setUploadedFile(file);
    try {
      const { text, fields } = await parseResumeFile(file);
      if (!text || text.length < 5) {
        throw new Error("Could not read any text from the file.");
      }
      dispatch(setExtractedProfile(fields));
      dispatch(setStatusCollect());
    } catch (e) {
      setError(e.message || "Failed to parse file.");
      setUploadedFile(null);
    } finally {
      setBusy(false);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!/pdf|docx$/i.test(file.name)) {
        setError("Invalid file type. Please upload a PDF or DOCX.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Max 10MB.");
        return;
      }
      handleFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/pdf|docx$/i.test(file.name)) {
      setError("Invalid file type. Please upload a PDF or DOCX.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      return;
    }
    handleFile(file);
  };

  const resetUpload = () => {
    setError("");
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileInput}
        className="hidden"
      />
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
          ${busy ? "pointer-events-none opacity-50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !busy && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`
            p-4 rounded-full transition-colors
            ${
              dragActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }
          `}
          >
            {busy ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : uploadedFile ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {busy
                ? "Processing your resume..."
                : uploadedFile
                ? "Resume uploaded successfully!"
                : "Upload your resume"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {busy
                ? "Please wait while we extract your information"
                : uploadedFile
                ? `File: ${uploadedFile.name}`
                : "Drag and drop your PDF or DOCX file here, or click to browse"}
            </p>
            {!busy && !uploadedFile && (
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX • Max size: 10MB
              </p>
            )}
          </div>
          {!busy && (
            <button
              type="button"
              className={`
                px-6 py-2 rounded-md font-medium transition-colors
                ${
                  uploadedFile
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (uploadedFile) {
                  resetUpload();
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              {uploadedFile ? "Upload Different File" : "Choose File"}
            </button>
          )}
        </div>
      </div>
      {uploadedFile && !busy && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-green-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={resetUpload}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <AlertCircle className="h-4 w-4" />
          </button>
        </div>
      )}
      {busy && (
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-800">Reading your resume…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}
    </div>
  );
}
