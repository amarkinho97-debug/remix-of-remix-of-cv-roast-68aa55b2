import { motion } from "framer-motion";
import { Trash2, Rocket } from "lucide-react";
 
 export const RedemptionSection = () => {
   return (
     <section className="py-20 bg-surface-elevated">
       <div className="container max-w-5xl mx-auto px-4">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
           <h2 className="text-3xl md:text-5xl font-black mb-4">
             Chega de passar vergonha?
           </h2>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Transforme seu CV de piada em arma secreta. É hora de parar de ser ignorado.
           </p>
         </motion.div>
 
         {/* Comparison Grid */}
         <div className="grid md:grid-cols-2 gap-8 mb-12">
           {/* Left - Current CV */}
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative"
           >
             <div className="bg-card border border-border rounded-xl p-8 h-full">
               {/* Bad badge */}
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-destructive/20 border border-destructive/40 rounded-full px-4 py-1">
                 <span className="text-xs font-bold text-destructive uppercase tracking-wide">
                   Seu CV Atual
                 </span>
               </div>
 
               <div className="flex items-center gap-4 mb-6 mt-2">
                 <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                   <Trash2 className="w-8 h-8 text-destructive" />
                 </div>
                 <div>
                   <p className="font-bold text-xl text-foreground">Lixeira do RH</p>
                   <p className="text-muted-foreground text-sm">Onde currículos ruins vão morrer</p>
                 </div>
               </div>
 
               <ul className="space-y-3">
                 {[
                   "Ignorado por recrutadores",
                   "Cheio de clichês genéricos",
                   "Formatação bagunçada",
                   "Reprovado pelo ATS",
                   "Sem palavras-chave relevantes"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <span className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center text-xs text-destructive">
                       ✗
                     </span>
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
           </motion.div>
 
           {/* Right - Optimized CV */}
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative"
           >
              <div className="bg-card border-2 border-primary/40 rounded-xl p-8 h-full glow-orange-subtle">
               {/* Good badge */}
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1">
                 <span className="text-xs font-bold text-primary uppercase tracking-wide">
                   CV Otimizado
                 </span>
               </div>
 
               <div className="flex items-center gap-4 mb-6 mt-2">
                 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                   <Rocket className="w-8 h-8 text-primary" />
                 </div>
                 <div>
                   <p className="font-bold text-xl text-foreground">Máquina de Entrevistas</p>
                   <p className="text-muted-foreground text-sm">Feito para impressionar</p>
                 </div>
               </div>
 
               <ul className="space-y-3">
                 {[
                   "Passa pelos filtros de ATS",
                   "Palavras-chave otimizadas",
                   "Resumo executivo de alto nível",
                   "Formatação profissional",
                   "Destacado para recrutadores"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-foreground">
                     <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                       ✓
                     </span>
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 };