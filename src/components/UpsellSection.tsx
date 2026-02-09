 import { motion } from "framer-motion";
 import { Lock, Sparkles, CheckCircle, Megaphone } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 export const UpsellSection = () => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.5, duration: 0.5 }}
       className="w-full max-w-2xl mx-auto mt-12"
     >
       <div className="relative rounded-lg overflow-hidden">
         {/* Blurred content preview */}
         <div className="blur-overlay bg-card border border-border rounded-lg p-8">
           <div className="space-y-4">
             <div className="h-4 bg-muted rounded w-3/4"></div>
             <div className="h-4 bg-muted rounded w-full"></div>
             <div className="h-4 bg-muted rounded w-5/6"></div>
             <div className="h-4 bg-muted rounded w-2/3"></div>
             <div className="mt-6 space-y-2">
               <div className="h-3 bg-muted/50 rounded w-full"></div>
               <div className="h-3 bg-muted/50 rounded w-4/5"></div>
             </div>
           </div>
         </div>
 
         {/* Overlay content */}
         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
           <div className="bg-background/90 backdrop-blur-sm rounded-xl p-8 border border-border max-w-md">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
               <Megaphone className="w-6 h-6 text-primary" />
             </div>
             
             <h3 className="text-xl font-bold text-foreground mb-2">
               Transformação Completa
             </h3>
             
             <p className="text-muted-foreground mb-6">
               Cansou de passar vergonha? Transforme seu CV em uma máquina de entrevistas.
             </p>
 
             <div className="space-y-2 text-left mb-6">
               {[
                 "Reescrita de CV com IA",
                 "Formatação otimizada para ATS",
                 "Palavras-chave do seu setor",
                 "Ajuste de tom profissional"
               ].map((feature, i) => (
                 <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                   <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                   <span>{feature}</span>
                 </div>
               ))}
             </div>
 
             <Button className="w-full gap-2 glow-orange" size="lg">
               <Sparkles className="w-4 h-4" />
               Desbloquear Transformação (R$ 14,90)
             </Button>
 
             <p className="text-xs text-muted-foreground mt-3">
               Pagamento único • Entrega instantânea
             </p>
           </div>
         </div>
       </div>
     </motion.div>
   );
 };