 import { motion } from "framer-motion";
 import { Megaphone, Quote } from "lucide-react";
 
 const TESTIMONIALS = [
   {
     name: "Ana",
     role: "Marketing",
     quote: "Achei que meu CV tava bom. O CV Sincero me mostrou que 'proativa' não é diferencial, é obrigação. 😅",
     avatar: "🙈"
   },
   {
     name: "Carlos",
     role: "Desenvolvedor",
     quote: "Listei 47 tecnologias. O CV Sincero perguntou: 'Sabe usar alguma direito?' Doeu, mas precisava ouvir.",
     avatar: "💀"
   },
   {
     name: "Juliana",
     role: "RH",
     quote: "Irônico uma pessoa de RH precisar de ajuda com CV. Mas foi a melhor análise que já recebi!",
     avatar: "😭"
   }
 ];
 
 export const HallOfFame = () => {
   return (
     <section className="py-20 overflow-hidden">
       <div className="container max-w-6xl mx-auto px-4">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-12"
         >
           <h2 className="text-3xl md:text-4xl font-black mb-4">
             Quem já recebeu a real{" "}
             <span className="inline-block">📢</span>
           </h2>
           <p className="text-muted-foreground text-lg">
             Você não está sozinho nessa jornada de autoconhecimento profissional.
           </p>
         </motion.div>
 
         {/* Horizontal Scroll Cards */}
         <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
           {TESTIMONIALS.map((testimonial, index) => (
             <motion.div
               key={testimonial.name}
               initial={{ opacity: 0, y: 30, rotate: -2 }}
               whileInView={{ opacity: 1, y: 0, rotate: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               whileHover={{ scale: 1.02, rotate: 1 }}
               className="min-w-[300px] md:min-w-0 snap-center"
             >
               <div className="bg-card border border-border rounded-xl p-6 h-full relative overflow-hidden group">
                 {/* Quote decoration */}
                 <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                 
                 {/* Avatar and info */}
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                     {testimonial.avatar}
                   </div>
                   <div>
                     <p className="font-bold text-foreground">{testimonial.name}</p>
                     <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                   </div>
                 </div>
 
                 {/* Quote text */}
                 <p className="text-foreground/90 leading-relaxed italic">
                   "{testimonial.quote}"
                 </p>
 
                 {/* Megaphone badge */}
                 <div className="absolute bottom-4 right-4">
                   <Megaphone className="w-5 h-5 text-primary/40" />
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };