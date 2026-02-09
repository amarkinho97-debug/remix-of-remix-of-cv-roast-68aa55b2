 import { motion, useMotionValue, useTransform, animate } from "framer-motion";
 import { useEffect, useState } from "react";
 import { Megaphone, Users } from "lucide-react";
 
 interface RoastCounterProps {
   count: number;
 }
 
 export const RoastCounter = ({ count }: RoastCounterProps) => {
   const motionCount = useMotionValue(0);
   const rounded = useTransform(motionCount, (latest) => Math.floor(latest).toLocaleString('pt-BR'));
   const [displayCount, setDisplayCount] = useState("0");
 
   useEffect(() => {
     const controls = animate(motionCount, count, {
       duration: 2,
       ease: "easeOut",
     });
 
     const unsubscribe = rounded.on("change", (v) => setDisplayCount(v));
 
     return () => {
       controls.stop();
       unsubscribe();
     };
   }, [count, motionCount, rounded]);
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.4 }}
       className="flex items-center justify-center gap-6 py-6 px-8 bg-card/50 border border-border rounded-xl backdrop-blur-sm"
     >
       <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
           <Megaphone className="w-5 h-5 text-primary" />
         </div>
         <div>
           <motion.p 
             className="text-2xl md:text-3xl font-black text-foreground"
             key={displayCount}
           >
             {displayCount}
           </motion.p>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
             CVs Analisados
           </p>
         </div>
       </div>
 
       <div className="w-px h-12 bg-border" />
 
       <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
           <Users className="w-5 h-5 text-primary" />
         </div>
         <div>
           <p className="text-2xl md:text-3xl font-black text-foreground">
             98%
           </p>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
             Aprenderam
           </p>
         </div>
       </div>
     </motion.div>
   );
 };