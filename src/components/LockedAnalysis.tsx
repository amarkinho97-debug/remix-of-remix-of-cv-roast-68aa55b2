 import { motion } from "framer-motion";
 import { Lock, BarChart3, FileText, CheckCircle2, TrendingUp } from "lucide-react";
 
 export const LockedAnalysis = () => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.5, duration: 0.5 }}
       className="w-full max-w-2xl mx-auto mt-6 relative z-10"
     >
       <div className="relative rounded-lg overflow-hidden border border-border">
         {/* Blurred fake content */}
         <div className="p-6 space-y-6" style={{ filter: 'blur(6px)' }}>
           {/* Fake chart */}
           <div className="flex items-center gap-4">
             <BarChart3 className="w-12 h-12 text-muted-foreground" />
             <div className="flex-1 space-y-2">
               <div className="h-4 bg-muted rounded w-3/4"></div>
               <div className="h-3 bg-muted/50 rounded w-1/2"></div>
             </div>
           </div>
 
           {/* Fake error list */}
           <div className="space-y-3">
             {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div key={i} className="flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                 <div className="flex-1 space-y-1">
                   <div className="h-4 bg-muted rounded" style={{ width: `${60 + Math.random() * 30}%` }}></div>
                   <div className="h-3 bg-muted/50 rounded" style={{ width: `${40 + Math.random() * 40}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
 
           {/* Fake rewritten section */}
           <div className="border-t border-border pt-4 space-y-3">
             <div className="flex items-center gap-2">
               <FileText className="w-5 h-5 text-primary" />
               <div className="h-4 bg-muted rounded w-40"></div>
             </div>
             <div className="space-y-2 pl-7">
               <div className="h-3 bg-muted/70 rounded w-full"></div>
               <div className="h-3 bg-muted/70 rounded w-5/6"></div>
               <div className="h-3 bg-muted/70 rounded w-4/5"></div>
               <div className="h-3 bg-muted/70 rounded w-3/4"></div>
             </div>
           </div>
 
           {/* Fake improvement stats */}
           <div className="flex items-center justify-around pt-4 border-t border-border">
             <div className="text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto" />
               <div className="h-4 bg-muted rounded w-16 mt-2"></div>
             </div>
             <div className="text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto" />
               <div className="h-4 bg-muted rounded w-16 mt-2"></div>
             </div>
             <div className="text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto" />
               <div className="h-4 bg-muted rounded w-16 mt-2"></div>
             </div>
           </div>
         </div>
 
         {/* Overlay with lock and text */}
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="text-center px-6"
           >
             <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
               <Lock className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-foreground mb-2">
               Análise Completa Bloqueada
             </h3>
             <p className="text-muted-foreground max-w-sm">
               A IA encontrou mais <span className="text-primary font-bold">7 erros graves</span> e 
               reescreveu seu resumo. Desbloqueie para ver.
             </p>
           </motion.div>
         </div>
       </div>
     </motion.div>
   );
 };