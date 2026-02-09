import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "dragging" | "extracting" | "success" | "error";

interface PDFUploaderProps {
  onTextExtracted: (text: string) => void;
  isAnalyzing?: boolean;
}

// Declare global pdfjsLib type
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// Load PDF.js from CDN
const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const PDFUploader = ({ onTextExtracted, isAnalyzing }: PDFUploaderProps) => {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText.trim();
  };

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      setState("error");
      setErrorMessage("Por favor, envie apenas arquivos PDF.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setState("error");
      setErrorMessage("Arquivo muito grande. Máximo: 10MB.");
      return;
    }

    setFileName(file.name);
    setState("extracting");
    setErrorMessage(null);

    try {
      const text = await extractTextFromPDF(file);
      
      if (!text || text.length < 50) {
        setState("error");
        setErrorMessage("Não consegui extrair texto suficiente. O PDF pode ser uma imagem.");
        return;
      }

      setState("success");
      
      // Small delay to show success state before triggering analysis
      setTimeout(() => {
        onTextExtracted(text);
      }, 500);
      
    } catch (error) {
      console.error("PDF extraction error:", error);
      setState("error");
      setErrorMessage("Erro ao ler o PDF. Tente outro arquivo.");
    }
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const resetUploader = () => {
    setState("idle");
    setFileName(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isProcessing = state === "extracting" || isAnalyzing;

  return (
    <div className="w-full space-y-4">
      <motion.div
        onClick={!isProcessing ? handleClick : undefined}
        onDrop={!isProcessing ? handleDrop : undefined}
        onDragOver={!isProcessing ? handleDragOver : undefined}
        onDragLeave={!isProcessing ? handleDragLeave : undefined}
        className={cn(
          "relative min-h-[280px] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
          "flex flex-col items-center justify-center gap-4 p-8",
          state === "idle" && "border-orange-500/30 bg-secondary/20 hover:border-primary hover:bg-secondary/30",
          state === "dragging" && "border-primary bg-primary/10 scale-[1.02]",
          state === "extracting" && "border-primary/50 bg-secondary/20 cursor-wait",
          state === "success" && "border-green-500/50 bg-green-500/5",
          state === "error" && "border-destructive/50 bg-destructive/5",
          isAnalyzing && "border-primary bg-primary/5"
        )}
        animate={{
          boxShadow: state === "dragging" 
            ? "0 0 30px rgba(249, 115, 22, 0.3)" 
            : state === "success"
            ? "0 0 20px rgba(34, 197, 94, 0.2)"
            : "0 10px 30px rgba(249, 115, 22, 0.1)"
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {/* Idle State */}
          {state === "idle" && !isAnalyzing && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Arraste seu CV aqui
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou clique para selecionar um arquivo PDF
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                <FileText className="w-4 h-4" />
                <span>Apenas PDF • Máximo 10MB</span>
              </div>
            </motion.div>
          )}

          {/* Dragging State */}
          {state === "dragging" && (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="p-4 rounded-full bg-primary/20"
              >
                <Upload className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="text-lg font-bold text-primary">
                Solte o arquivo aqui! 📂
              </p>
            </motion.div>
          )}

          {/* Extracting State */}
          {state === "extracting" && (
            <motion.div
              key="extracting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Lendo PDF... 📖
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fileName}
                </p>
              </div>
            </motion.div>
          )}

          {/* Success State (brief) */}
          {state === "success" && !isAnalyzing && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-4 rounded-full bg-green-500/20"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <p className="text-lg font-semibold text-green-600">
                Texto extraído! ✅
              </p>
            </motion.div>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Analisando com sinceridade... 🔥
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fileName}
                </p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 rounded-full bg-destructive/20">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-destructive">
                  Ops! 😬
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {errorMessage}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetUploader();
                }}
                className="text-sm text-primary hover:underline"
              >
                Tentar novamente
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-center text-sm text-muted-foreground">
        Grátis • Sem cadastro • Processado no seu navegador 🔒
      </p>
    </div>
  );
};
