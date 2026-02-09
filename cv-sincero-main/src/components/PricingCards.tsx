import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ===========================================
// MERCADO PAGO PAYMENT URLS - Edit these!
// ===========================================
export const MERCADO_PAGO_DOSSIE_URL = "https://mpago.la/1TngGUE";
export const MERCADO_PAGO_PREMIUM_URL = "https://mpago.la/2yyNN3t";

// localStorage key for pending analysis
export const PENDING_ROAST_KEY = "pending_roast";

interface PricingTier {
  name: string;
  price: string;
  priceNote?: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  highlighted?: boolean;
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Só a Resenha",
    price: "Grátis",
    features: ["Nota da IA", "Piadinha Inicial", "1 Erro apontado"],
    buttonText: "Já tenho",
    buttonVariant: "ghost",
    disabled: true,
  },
  {
    name: "Dossiê da Verdade",
    price: "R$ 9,90",
    features: [
      "Lista de TODOS os erros",
      "Explicação do porquê tá ruim",
      "Dicas de correção",
    ],
    buttonText: "Ver Meus Erros",
    buttonVariant: "secondary",
  },
  {
    name: "Primo Resolve",
    price: "R$ 19,90",
    features: [
      "Tudo do Dossiê",
      "Reescrita Profissional do Resumo",
      "Reescrita das Experiências",
      "Pronto para copiar e colar",
    ],
    buttonText: "Quero meu CV Novo",
    buttonVariant: "default",
    highlighted: true,
    badge: "Escolha do Primo 👑",
  },
];

interface PricingCardsProps {
  cvText: string;
  roastResult: string;
}

// Helper to save pending analysis to localStorage
const savePendingRoast = (cvText: string, roastResult: string) => {
  const data = {
    cvText,
    roastResult,
    timestamp: Date.now(),
  };
  localStorage.setItem(PENDING_ROAST_KEY, JSON.stringify(data));
};

export const PricingCards = ({ cvText, roastResult }: PricingCardsProps) => {
  const handlePurchase = (tierIndex: number) => {
    if (tierIndex === 1) {
      // Dossiê tier - save and redirect
      savePendingRoast(cvText, roastResult);
      window.location.href = MERCADO_PAGO_DOSSIE_URL;
    } else if (tierIndex === 2) {
      // Premium tier - save and redirect
      savePendingRoast(cvText, roastResult);
      window.location.href = MERCADO_PAGO_PREMIUM_URL;
    }
  };

  // Default: show pricing cards
   return (
     <motion.div
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.7, duration: 0.5 }}
       className="w-full max-w-4xl mx-auto mt-10 relative z-50"
     >
       <div className="text-center mb-8">
         <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
           Escolha Seu Destino
         </h2>
         <p className="text-muted-foreground">
           Quanto você quer saber sobre a verdade do seu CV?
         </p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {pricingTiers.map((tier, index) => (
           <motion.div
             key={tier.name}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8 + index * 0.1 }}
           >
            <Card
                className={`relative h-full flex flex-col overflow-visible ${
                  tier.highlighted
                    ? "border-2 border-primary glow-orange bg-gradient-to-b from-primary/5 to-transparent"
                    : "border-border"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold shadow-lg whitespace-nowrap">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
 
               <CardHeader className={tier.badge ? "pt-6" : ""}>
                 <CardTitle className="text-xl font-bold flex items-center justify-center gap-2 w-full text-center">
                   {tier.highlighted && <Crown className="w-5 h-5 text-primary" />}
                   {tier.name}
                 </CardTitle>
                 <CardDescription className="text-center">
                   <span
                     className={`text-3xl font-black ${
                       tier.highlighted ? "text-primary" : "text-foreground"
                     }`}
                   >
                     {tier.price}
                   </span>
                   {tier.priceNote && (
                     <span className="text-sm text-muted-foreground ml-1">
                       {tier.priceNote}
                     </span>
                   )}
                 </CardDescription>
               </CardHeader>
 
               <CardContent className="flex-1">
                 <ul className="space-y-3">
                   {tier.features.map((feature, featureIndex) => (
                     <li key={featureIndex} className="flex items-start gap-2">
                       <Check
                         className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                           tier.highlighted ? "text-primary" : "text-muted-foreground"
                         }`}
                       />
                       <span
                         className={`text-sm ${
                           feature.includes("Reescrita")
                             ? "font-semibold text-foreground"
                             : "text-muted-foreground"
                         }`}
                       >
                         {feature}
                       </span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
 
                <CardFooter>
                  <Button
                    type="button"
                    className={`w-full gap-2 min-h-[48px] py-4 active:scale-95 transition-transform ${
                      tier.highlighted ? "glow-orange animate-pulse-glow" : ""
                    }`}
                    variant={tier.buttonVariant}
                    disabled={tier.disabled}
                    onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       if (!tier.disabled) handlePurchase(index);
                     }}
                  >
                    {tier.highlighted && <Sparkles className="w-4 h-4" />}
                    {tier.buttonText}
                  </Button>
                </CardFooter>
             </Card>
           </motion.div>
         ))}
       </div>
 
       <p className="text-center text-sm text-muted-foreground mt-6">
         Pagamento único • Entrega instantânea • Satisfação garantida
       </p>
     </motion.div>
   );
 };