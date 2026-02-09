import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Lightbulb, ArrowRight, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MERCADO_PAGO_PREMIUM_URL } from "@/components/PricingCards";
import { supabase } from "@/integrations/supabase/client";

interface DossieError {
  error: string;
  whyBad: string;
  howToFix: string;
}

interface DossiePayload {
  errors: DossieError[];
}

interface DossieViewProps {
  cvText: string;
  onUpgrade?: () => void;
}

export const DossieView = ({ cvText, onUpgrade }: DossieViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dossie, setDossie] = useState<DossiePayload | null>(null);

  const errors = useMemo(() => dossie?.errors ?? [], [dossie]);

  useEffect(() => {
    const fetchDossie = async () => {
      if (!cvText?.trim()) {
        setError("Faça o upload do PDF para ver seus erros reais.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("roast-cv", {
          body: { cvText, mode: "dossie" },
        });

        if (fnError) {
          console.error("Error calling dossie:", fnError);
          setError(fnError.message || "Erro ao gerar dossiê");
          return;
        }

        if (data?.error) {
          setError(data.error);
          return;
        }

        if (data?.dossie?.errors) {
          setDossie(data.dossie as DossiePayload);
        } else {
          setError("Resposta inválida do dossiê. Tente novamente.");
        }
      } catch (err) {
        console.error("Unexpected dossie error:", err);
        setError("Erro inesperado. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossie();
  }, [cvText]);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      window.location.href = MERCADO_PAGO_PREMIUM_URL;
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto mt-8 px-4 pb-24"
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
          <CardContent className="py-16 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Montando seu dossiê...</h3>
            <p className="text-muted-foreground">Pegando os erros reais do seu PDF</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto mt-8 px-4 pb-24"
      >
        <Card className="border-2 border-destructive/20 bg-gradient-to-b from-destructive/5 to-transparent">
          <CardContent className="py-16 text-center">
            <RefreshCw className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Não deu pra gerar o dossiê</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-8 px-4 pb-24"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4"
        >
          <FileText className="w-8 h-8 text-secondary-foreground" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">
          Dossiê Completo: {errors.length} {errors.length === 1 ? "Erro" : "Erros"} Encontrado(s) 📂
        </h2>
        <p className="text-muted-foreground">Aqui está o que está sabotando suas chances</p>
      </div>

      {/* Errors List */}
      <div className="space-y-4">
        {errors.length > 0 ? (
          errors.map((item, index) => (
            <motion.div
              key={`${index}-${item.error}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * index }}
            >
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center text-xs text-destructive font-bold">
                      {index + 1}
                    </span>
                    {item.error}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-destructive uppercase tracking-wide">Por que é ruim</span>
                      <p className="text-sm text-muted-foreground">{item.whyBad}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">Como corrigir</span>
                      <p className="text-sm text-foreground">{item.howToFix}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="p-10 text-center">
              <p className="text-lg font-bold text-foreground mb-2">Nenhum erro encontrado (milagre?)</p>
              <p className="text-sm text-muted-foreground">
                Se seu PDF tiver poucas informações, tenta exportar em texto ou subir outra versão com mais detalhes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upsell Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10"
      >
        <Separator className="mb-10" />
        <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 overflow-visible">
          <CardContent className="p-6 pb-8 text-center overflow-visible">
            <p className="text-lg font-bold text-foreground mb-2">Com preguiça de arrumar isso tudo sozinho? 😅</p>
            <p className="text-sm text-muted-foreground mb-4">
              Deixa que o Primo resolve pra você. CV reescrito e pronto pra copiar.
            </p>
            <Button
              onClick={handleUpgrade}
              size="lg"
              className="gap-2 glow-orange animate-pulse-glow min-h-[48px] py-4 active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              Fazer Upgrade para Primo Resolve (+ R$ 10,00)
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};