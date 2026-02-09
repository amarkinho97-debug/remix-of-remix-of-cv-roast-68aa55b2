import { motion } from "framer-motion";
import { Megaphone, AlertCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SocialShare } from "@/components/SocialShare";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

interface FreemiumResultProps {
  verdict: string;
}
 
 // Parse the verdict to extract structured data
 const parseVerdict = (verdict: string) => {
   // Extract score from "Nota: X/10" pattern
   const scoreMatch = verdict.match(/Nota:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
   const score = scoreMatch ? parseFloat(scoreMatch[1]) : 5;
 
   // Extract first impression (📢 A PRIMEIRA IMPRESSÃO section)
   const firstImpressionMatch = verdict.match(/📢\s*A PRIMEIRA IMPRESSÃO\s*\n([^\n✅😬📊]+)/i);
   const firstImpression = firstImpressionMatch 
     ? firstImpressionMatch[1].trim() 
     : "Seu CV tem potencial, mas precisa de ajustes...";
 
   // Extract one critical error from "😬 O CHOQUE DE REALIDADE" section
   const realityCheckMatch = verdict.match(/😬\s*O CHOQUE DE REALIDADE\s*\n([\s\S]*?)(?=📊|$)/i);
   let criticalError = "Falta de métricas e resultados concretos nas experiências.";
   
   if (realityCheckMatch) {
     const errors = realityCheckMatch[1].match(/•\s*([^\n•]+)/g);
     if (errors && errors.length > 0) {
       criticalError = errors[0].replace(/^•\s*/, '').trim();
     }
   }
 
   return { score, firstImpression, criticalError };
 };
 
export const FreemiumResult = ({ verdict }: FreemiumResultProps) => {
  const { score, firstImpression, criticalError } = parseVerdict(verdict);
  const cardRef = useRef<HTMLDivElement>(null);
 
   // Fire confetti on mount
   useEffect(() => {
     const fireConfetti = () => {
       confetti({
         particleCount: 50,
         spread: 60,
         origin: { x: 0.2, y: 0.6 },
         colors: ['#f97316', '#f59e0b', '#fbbf24', '#fb923c'],
         shapes: ['circle'],
         gravity: 1.2,
       });
       confetti({
         particleCount: 50,
         spread: 60,
         origin: { x: 0.8, y: 0.6 },
         colors: ['#f97316', '#f59e0b', '#fbbf24', '#fb923c'],
         shapes: ['circle'],
         gravity: 1.2,
       });
     };
     const timer = setTimeout(fireConfetti, 300);
     return () => clearTimeout(timer);
   }, []);
 
   // Determine score color
   const getScoreColor = (score: number) => {
     if (score >= 7) return "text-green-500";
     if (score >= 5) return "text-amber-500";
     return "text-destructive";
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, scale: 0.9, y: 20 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       transition={{ duration: 0.5, ease: "easeOut" }}
       className="w-full max-w-2xl mx-auto"
     >
       <Card ref={cardRef} className="border-2 border-primary/60 bg-card overflow-hidden glow-orange-subtle">
         {/* Header with stamp */}
         <CardHeader className="relative pb-4">
           <div className="absolute -top-1 -right-8 z-10">
             <motion.div 
               className="stamp-effect text-sm"
               initial={{ scale: 0, rotate: -30 }}
               animate={{ scale: 1, rotate: -12 }}
               transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
             >
               ANALISADO
             </motion.div>
           </div>
           <div className="flex items-center gap-2 mb-2">
             <Megaphone className="w-6 h-6 text-primary" />
             <span className="text-sm font-medium text-muted-foreground">Resultado Gratuito</span>
           </div>
         </CardHeader>
 
         <CardContent className="space-y-6">
           {/* Score Section */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-center py-4 border-b border-border"
           >
             <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Veredito</p>
             <div className="flex items-center justify-center gap-2">
               <Star className="w-8 h-8 text-primary fill-primary" />
               <span className={`text-6xl font-black ${getScoreColor(score)}`}>
                 {score}
               </span>
               <span className="text-2xl text-muted-foreground font-medium">/10</span>
             </div>
           </motion.div>
 
           {/* First Impression */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="py-4 border-b border-border"
           >
             <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider">
               📢 Primeira Impressão
             </p>
             <p className="text-lg text-foreground leading-relaxed italic">
               "{firstImpression}"
             </p>
           </motion.div>
 
           {/* One Critical Error */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="py-4"
           >
             <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider">
               😬 Erro Crítico Encontrado
             </p>
             <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
               <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
               <p className="text-foreground">
                 {criticalError}
               </p>
             </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Social Share Buttons */}
        <SocialShare score={score} firstImpression={firstImpression} cardRef={cardRef} />
      </motion.div>
    );
  };