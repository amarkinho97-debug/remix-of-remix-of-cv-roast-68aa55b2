 import { motion } from "framer-motion";
 import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
 } from "@/components/ui/accordion";
 
 const FAQ_ITEMS = [
   {
     question: "Isso é seguro? Meus dados ficam salvos?",
    answer: "Relaxa! Não salvamos nenhum dado do seu CV. Assim que você fecha a página, tudo some. A gente só quer te ajudar com honestidade, não roubar seus dados."
   },
   {
    question: "Quem cria as análises?",
    answer: "Uma IA treinada em milhares de CVs e no feedback honesto de recrutadores experientes. Ela aprendeu o que funciona e o que não funciona de verdade."
   },
   {
     question: "Como funciona a versão paga?",
    answer: "Depois de receber a análise, você pode pagar R$ 14,90 para receber uma versão profissional do seu CV. A IA reescreve seu currículo com palavras-chave otimizadas para ATS, formatação profissional e um resumo executivo que destaca seu potencial."
   },
   {
     question: "Posso usar isso para zoar meus amigos?",
    answer: "Claro! Compartilhe o link ou o card da análise nas redes sociais. Quanto mais gente descobrir a verdade sobre seus CVs, melhor pro mercado todo."
   },
   {
    question: "E se eu concordar com a análise?",
    answer: "Então você tem autoconhecimento e está pronto pra melhorar. Pessoas que aceitam feedback construtivo tendem a evoluir rápido. Esse é o espírito!"
   }
 ];
 
 export const FAQSection = () => {
   return (
     <section className="py-20">
       <div className="container max-w-3xl mx-auto px-4">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-12"
         >
           <h2 className="text-3xl md:text-4xl font-black mb-4">
             Perguntas Frequentes
           </h2>
           <p className="text-muted-foreground text-lg">
             Tudo que você precisa saber (mas tinha vergonha de perguntar)
           </p>
         </motion.div>
 
         {/* Accordion */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           <Accordion type="single" collapsible className="space-y-4">
             {FAQ_ITEMS.map((item, index) => (
               <AccordionItem
                 key={index}
                 value={`item-${index}`}
                 className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/40 transition-colors"
               >
                 <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                   {item.question}
                 </AccordionTrigger>
                 <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                   {item.answer}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
         </motion.div>
       </div>
     </section>
   );
 };