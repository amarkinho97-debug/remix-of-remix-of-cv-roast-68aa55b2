import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Copy, Check, Briefcase, User, Download, Loader2, RefreshCw, GraduationCap, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateDocx } from "@/utils/docxGenerator";
import type { RewrittenCV, WorkExperience } from "@/types/cv";

interface BlindedCVProps {
  cvText: string;
}

export const BlindedCV = ({ cvText }: BlindedCVProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rewrittenData, setRewrittenData] = useState<RewrittenCV | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch rewritten CV from AI
  useEffect(() => {
    const fetchRewrite = async () => {
      if (!cvText) {
        setError("Texto do CV não encontrado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('roast-cv', {
          body: { cvText, mode: "rewrite" }
        });

        if (fnError) {
          console.error('Error calling rewrite:', fnError);
          setError(fnError.message || "Erro ao processar CV");
          return;
        }

        if (data?.error) {
          setError(data.error);
          return;
        }

        if (data?.rewrite) {
          console.log("Received rewrite with", data.rewrite.workHistory?.length, "experiences");
          setRewrittenData(data.rewrite);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError("Erro inesperado. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewrite();
  }, [cvText]);

  const handleCopyAll = () => {
    if (!rewrittenData) return;
    
    const experiencesText = rewrittenData.workHistory
      .map(exp => `${exp.role} | ${exp.company}\n${exp.period}\n${exp.bullets.map(b => `• ${b}`).join('\n')}`)
      .join('\n\n');
    
    const fullText = `=== RESUMO PROFISSIONAL ===\n\n${rewrittenData.summary}\n\n=== EXPERIÊNCIA ===\n\n${experiencesText}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast({
      title: "Copiado! 📋",
      description: "Seu CV blindado está na área de transferência.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadWord = async () => {
    if (!rewrittenData) return;
    
    setIsDownloading(true);
    
    try {
      await generateDocx(rewrittenData);
      
      toast({
        title: "Download iniciado! 📥",
        description: `Seu CV completo com ${rewrittenData.workHistory.length} experiências está sendo baixado.`,
      });
    } catch (err) {
      console.error("Error generating DOCX:", err);
      toast({
        title: "Erro ao gerar arquivo",
        description: "Tente novamente ou use a opção de copiar.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto mt-8 px-4 pb-24"
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
          <CardContent className="py-16 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Reescrevendo seu currículo...</h3>
            <p className="text-muted-foreground">A IA está analisando todas as suas experiências</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Error state
  if (error || !rewrittenData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto mt-8 px-4 pb-24"
      >
        <Card className="border-2 border-destructive/20 bg-gradient-to-b from-destructive/5 to-transparent">
          <CardContent className="py-16 text-center">
            <RefreshCw className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Ops, algo deu errado</h3>
            <p className="text-muted-foreground mb-4">{error || "Não foi possível reescrever o CV"}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
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
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
        >
          <Shield className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">
          Seu Currículo Blindado 🛡️
        </h2>
        <p className="text-muted-foreground">
          Reescrito com {rewrittenData.workHistory.length} experiência(s) otimizada(s)
        </p>
      </div>

      {/* Tabs Content */}
      <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="summary" className="gap-1 text-xs md:text-sm">
                <User className="w-4 h-4" />
                Resumo
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-1 text-xs md:text-sm">
                <Briefcase className="w-4 h-4" />
                Experiências ({rewrittenData.workHistory.length})
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-1 text-xs md:text-sm">
                <GraduationCap className="w-4 h-4" />
                Formação
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-1 text-xs md:text-sm">
                <Wrench className="w-4 h-4" />
                Habilidades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {rewrittenData.summary}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="mt-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                {rewrittenData.workHistory.map((exp, index) => (
                  <div key={index} className={index > 0 ? "pt-6 border-t border-border" : ""}>
                    <h4 className="font-bold text-base text-foreground">
                      {exp.role} | {exp.company}
                    </h4>
                    <p className="text-sm text-muted-foreground italic mb-3">
                      {exp.period}
                    </p>
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="text-sm text-muted-foreground pl-4 relative">
                          <span className="absolute left-0">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                {rewrittenData.education && rewrittenData.education.length > 0 ? (
                  rewrittenData.education.map((edu, index) => (
                    <div key={index} className={index > 0 ? "pt-4 border-t border-border" : ""}>
                      <h4 className="font-bold text-base text-foreground">{edu.institution}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree}{edu.year ? ` (${edu.year})` : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhuma formação acadêmica encontrada no CV.</p>
                )}

                {rewrittenData.certifications && rewrittenData.certifications.length > 0 && (
                  <>
                    <h4 className="font-bold text-sm text-primary mt-4 pt-4 border-t border-border">Certificações</h4>
                    {rewrittenData.certifications.map((cert, index) => (
                      <div key={index}>
                        <p className="text-sm text-foreground font-medium">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cert.institution}{cert.year ? ` (${cert.year})` : ""}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-4">
              <div className="bg-card border border-border rounded-lg p-6">
                {rewrittenData.skills && rewrittenData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rewrittenData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhuma habilidade encontrada no CV.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {/* Download Word Button */}
          <Button
            onClick={handleDownloadWord}
            disabled={isDownloading}
            size="lg"
            className="w-full gap-2 glow-orange min-h-[48px]"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando arquivo...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Baixar Word (.docx)
              </>
            )}
          </Button>

          {/* Copy Button */}
          <Button
            onClick={handleCopyAll}
            variant="outline"
            size="lg"
            className="w-full gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar Texto
              </>
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground mt-3">
            Cole no seu documento e ajuste os detalhes específicos
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
