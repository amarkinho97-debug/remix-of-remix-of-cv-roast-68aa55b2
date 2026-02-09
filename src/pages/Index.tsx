import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Megaphone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreemiumResult } from "@/components/FreemiumResult";
import { LockedAnalysis } from "@/components/LockedAnalysis";
import { PricingCards, PENDING_ROAST_KEY } from "@/components/PricingCards";
import { PDFUploader } from "@/components/PDFUploader";
import { RoastCounter } from "@/components/RoastCounter";
import { HallOfFame } from "@/components/HallOfFame";
import { RedemptionSection } from "@/components/RedemptionSection";
import { FAQSection } from "@/components/FAQSection";
import { DossieView } from "@/components/DossieView";
import { BlindedCV } from "@/components/BlindedCV";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Removed - no longer needed with PDFUploader integrated loading

// Mock initial count (would come from backend in production)
const INITIAL_ANALYSIS_COUNT = 47823;

// View states after payment
type PaidView = "none" | "dossie" | "premium";
 
const Index = () => {
  const [cvText, setCvText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verdictResult, setVerdictResult] = useState<string | null>(null);
  const [analysisCount, setAnalysisCount] = useState(INITIAL_ANALYSIS_COUNT);
  const [paidView, setPaidView] = useState<PaidView>("none");

  // Developer backdoor: /?plan=premium or /?plan=dossie forces premium/dossie access
  // Priority over backend/auth; NEVER inject mock data here.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rawPlan = urlParams.get("plan") ?? urlParams.get("PLAN");
    const plan = rawPlan?.toLowerCase() ?? null;

    if (plan === "premium" || plan === "dossie") {
      // If we have a previously saved real analysis (from PricingCards flow), restore it.
      const pendingData = localStorage.getItem(PENDING_ROAST_KEY) || localStorage.getItem("pending_roast");

      if (pendingData) {
        try {
          const { cvText: savedCvText, roastResult } = JSON.parse(pendingData);
          if (typeof savedCvText === "string") setCvText(savedCvText);
          if (typeof roastResult === "string") setVerdictResult(roastResult);
        } catch (e) {
          console.error("Failed to parse pending roast data:", e);
        }
      }

      // Force paid view (bypasses payment validation for testing)
      setPaidView(plan);

      // Clean up URL without reload
      window.history.replaceState({}, "", window.location.pathname);

      toast({
        title: plan === "premium" ? "🔓 Modo Premium Ativado" : "🔓 Modo Dossiê Ativado",
        description: pendingData
          ? "Acesso de teste liberado via URL."
          : "Acesso liberado via URL — agora faça upload do PDF para ver seus dados reais.",
      });
    }
  }, []);

  // Handle text extracted from PDF and trigger analysis
  const handleTextExtracted = useCallback(async (text: string) => {
    setCvText(text);

    // QA bypass: /?qa=premium forces premium view after analysis
    const urlParams = new URLSearchParams(window.location.search);
    const qa = (urlParams.get("qa") ?? urlParams.get("QA"))?.toLowerCase();

    // Automatically start analysis
    setIsAnalyzing(true);
    setVerdictResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('roast-cv', {
        body: { cvText: text }
      });

      if (error) {
        console.error('Error calling roast-cv:', error);
        toast({
          title: "Eita, deu ruim!",
          description: error.message || "Algo deu errado. Tente novamente.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      if (data?.error) {
        toast({
          title: "Ops!",
          description: data.error,
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      setVerdictResult(data.roast);
      setAnalysisCount(prev => prev + 1);

      if (qa === "premium") {
        setPaidView("premium");
      } else if (qa === "dossie") {
        setPaidView("dossie");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Erro inesperado",
        description: "Algo deu muito errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Removed handleAnalyze - now handled by handleTextExtracted

  const handleShare = () => {
    if (verdictResult) {
      navigator.clipboard.writeText(
        `O CV Sincero analisou meu currículo 📢\n\n"${verdictResult}"\n\nDescubra a verdade sobre o seu: cvsincero.com.br`
      );
      toast({
        title: "Copiado!",
        description: "Agora manda pra galera ver a sinceridade.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container max-w-4xl mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-12">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-12"
          >
            <Megaphone className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black tracking-tight">
              CV Sincero
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
              Seu currículo tá passando{" "}
              <span className="text-gradient-sincero">vergonha</span>
              <br />
              ou tá passando no filtro?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              O <strong>CV Sincero</strong> analisa seu perfil com a honestidade que nenhum recrutador tem coragem de ter. De graça e sem massagem.
            </p>
          </motion.div>

          {/* Warning badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Aviso: Pode causar reflexões profundas
              </span>
            </div>
          </motion.div>

          {/* Analysis Counter */}
          <RoastCounter count={analysisCount} />
        </div>
      </section>

      {/* Interaction Area */}
       <section className="container max-w-4xl mx-auto px-4 py-12">
        {!verdictResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PDFUploader 
              onTextExtracted={handleTextExtracted}
              isAnalyzing={isAnalyzing}
            />
          </motion.div>
        )}

        {/* Result */}
        {verdictResult && !isAnalyzing && (
          <>
            {/* Free Result - always show */}
            <FreemiumResult verdict={verdictResult} />
 
            {/* Show paid content OR locked/pricing based on paidView state */}
            {paidView === "dossie" && (
              <DossieView cvText={cvText} />
            )}
            
            {paidView === "premium" && (
              <BlindedCV cvText={cvText} />
            )}
            
            {paidView === "none" && (
              <>
                {/* Locked Analysis with blur */}
                <LockedAnalysis />
                
                {/* Pricing Cards - redirect to Mercado Pago */}
                <PricingCards cvText={cvText} roastResult={verdictResult} />
              </>
            )}
 
            {/* Try Again Button - moved below pricing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mt-12"
            >
              <Button
                variant="ghost"
                onClick={() => {
                  setVerdictResult(null);
                  setCvText("");
                  setPaidView("none");
                  localStorage.removeItem(PENDING_ROAST_KEY);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Analisar outro CV
              </Button>
            </motion.div>
          </>
        )}
      </section>

      {/* Sections below the fold */}
      <HallOfFame />
      <RedemptionSection />
      <FAQSection />

      {/* Final Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            <span className="text-xl font-black">CV Sincero</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Feito com 📢 e honestidade duvidosa • Não passamos pano, mas passamos dicas
          </p>
          <p className="text-xs text-muted-foreground/60">
            © 2025 CV Sincero. Todos os direitos reservados (inclusive o de ser sincero).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
