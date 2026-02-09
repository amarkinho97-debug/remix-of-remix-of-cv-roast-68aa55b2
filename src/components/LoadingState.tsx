 import { motion, AnimatePresence } from "framer-motion";
 import { Megaphone } from "lucide-react";
 
 interface LoadingStateProps {
   currentText: string;
 }
 
 export const LoadingState = ({ currentText }: LoadingStateProps) => {
   return (
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="flex flex-col items-center justify-center py-20 gap-8"
     >
       {/* Animated megaphone icon */}
       <motion.div
         animate={{ 
           scale: [1, 1.2, 1],
           rotate: [0, 10, -10, 0]
         }}
         transition={{ 
           duration: 0.4, 
           repeat: Infinity,
           ease: "easeInOut"
         }}
       >
         <Megaphone className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
       </motion.div>
 
       {/* Loading dots */}
       <div className="flex gap-3">
         {[0, 1, 2].map((i) => (
           <motion.div
             key={i}
             className="w-4 h-4 rounded-full bg-primary"
             animate={{ 
               scale: [1, 1.5, 1],
               opacity: [0.5, 1, 0.5]
             }}
             transition={{ 
               duration: 0.5, 
               repeat: Infinity,
               delay: i * 0.2
             }}
           />
         ))}
       </div>
 
       {/* Funny loading text */}
       <AnimatePresence mode="wait">
         <motion.p
           key={currentText}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="text-muted-foreground text-xl font-semibold"
         >
           {currentText}
         </motion.p>
       </AnimatePresence>
     </motion.div>
   );
 };