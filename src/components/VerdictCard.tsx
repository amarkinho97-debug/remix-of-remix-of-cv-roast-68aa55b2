 import { motion } from "framer-motion";
 import { Share2, Download, Megaphone, Twitter, Linkedin, Link2, MessageCircle } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useRef, useEffect } from "react";
 import confetti from "canvas-confetti";
 import { toast } from "@/hooks/use-toast";
 
 interface VerdictCardProps {
   verdict: string;
   onShare: () => void;
 }
 
 export const VerdictCard = ({ verdict, onShare }: VerdictCardProps) => {
   const cardRef = useRef<HTMLDivElement>(null);
 
   // Fire confetti on mount
   useEffect(() => {
     const fireConfetti = () => {
       // Fire from left
       confetti({
         particleCount: 50,
         spread: 60,
         origin: { x: 0.2, y: 0.6 },
         colors: ['#f97316', '#f59e0b', '#fbbf24', '#fb923c'],
         shapes: ['circle'],
         gravity: 1.2,
       });
       // Fire from right
       confetti({
         particleCount: 50,
         spread: 60,
         origin: { x: 0.8, y: 0.6 },
         colors: ['#f97316', '#f59e0b', '#fbbf24', '#fb923c'],
         shapes: ['circle'],
         gravity: 1.2,
       });
     };
 
     // Small delay for dramatic effect
     const timer = setTimeout(fireConfetti, 300);
     return () => clearTimeout(timer);
   }, []);
 
   const handleDownload = () => {
     alert("Recurso de download em breve! Compartilhe nas redes por enquanto 📢");
   };
 
   const shareText = `O CV Sincero analisou meu currículo 📢\n\n"${verdict.slice(0, 200)}..."\n\nDescubra a verdade sobre o seu:`;
   const shareUrl = "https://cvsincero.com.br";
 
   const handleShareTwitter = () => {
     const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
     window.open(twitterUrl, '_blank', 'width=600,height=400');
   };
 
   const handleShareLinkedIn = () => {
     const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
     window.open(linkedInUrl, '_blank', 'width=600,height=400');
   };
 
   const handleCopyLink = () => {
     navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
     toast({
       title: "Copiado!",
       description: "Agora manda pra galera conferir.",
     });
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, scale: 0.8, y: 30, rotate: -2 }}
       animate={{ 
         opacity: 1, 
         scale: 1, 
         y: 0, 
         rotate: 0,
       }}
       transition={{ 
         duration: 0.6, 
         ease: [0.34, 1.56, 0.64, 1],
       }}
       className="w-full max-w-2xl mx-auto"
     >
       {/* Shake animation wrapper */}
       <motion.div
         animate={{ 
           x: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0],
         }}
         transition={{ 
           duration: 0.6,
           delay: 0.3,
           ease: "easeInOut"
         }}
       >
       {/* The shareable card */}
       <div
         ref={cardRef}
         className="card-verdict rounded-lg relative overflow-hidden glow-orange-subtle"
       >
         {/* ANALISADO stamp */}
         <div className="absolute -top-1 -right-8 z-10">
           <motion.div 
             className="stamp-effect text-sm"
             initial={{ scale: 0, rotate: -30 }}
             animate={{ scale: 1, rotate: -12 }}
             transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
           >
             ANALISADO
           </motion.div>
         </div>
 
         {/* Megaphone decoration */}
         <div className="absolute top-4 left-4">
           <Megaphone className="w-6 h-6 text-primary" />
         </div>
 
         {/* Content */}
         <div className="pt-8 pb-4">
           <div className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-wrap">
             {verdict}
           </div>
           
           <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-2">
               <MessageCircle className="w-4 h-4 text-primary" />
               <span className="text-sm text-muted-foreground font-semibold tracking-wide">
                 CV Sincero
               </span>
             </div>
             <span className="text-xs text-muted-foreground">
               #CVSincero
             </span>
           </div>
         </div>
       </div>
       </motion.div>
 
       {/* Action buttons */}
       <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="mt-6 space-y-4"
       >
         {/* Social Share Buttons */}
         <div className="flex gap-3 justify-center flex-wrap">
           <Button
             onClick={handleShareTwitter}
             className="gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
           >
             <Twitter className="w-4 h-4" />
             Twitter / X
           </Button>
           <Button
             onClick={handleShareLinkedIn}
             className="gap-2 bg-[#0A66C2] hover:bg-[#094d92] text-white"
           >
             <Linkedin className="w-4 h-4" />
             LinkedIn
           </Button>
           <Button
             onClick={handleCopyLink}
             variant="outline"
             className="gap-2"
           >
             <Link2 className="w-4 h-4" />
             Copiar Link
           </Button>
         </div>
 
         {/* Download button */}
         <div className="flex justify-center">
           <Button
             onClick={handleDownload}
             variant="ghost"
             className="gap-2 text-muted-foreground hover:text-foreground"
           >
             <Download className="w-4 h-4" />
             Baixar Imagem
           </Button>
         </div>
       </motion.div>
     </motion.div>
   );
 };