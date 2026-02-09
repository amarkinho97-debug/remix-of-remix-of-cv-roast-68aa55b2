import { useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Linkedin, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface SocialShareProps {
  score: number;
  firstImpression: string;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const SocialShare = ({ score, firstImpression, cardRef }: SocialShareProps) => {
  const siteUrl = "https://cv-roast-bot.lovable.app";
  
  // Truncate first impression for share text
  const shortImpression = firstImpression.length > 80 
    ? firstImpression.slice(0, 80) + "..." 
    : firstImpression;

  const handleWhatsAppShare = () => {
    // Clean verdict: remove double quotes, truncate to 100 chars
    const cleanVerdict = firstImpression
      .replace(/"/g, '')
      .slice(0, 100)
      .trim();
    
    const shareText = `💀 Agora eu entendi por que o RH nunca me chama...

A IA analisou meu currículo e a verdade doeu. 👇

📉 Score: ${Math.round(score)}/100
🗣️ Veredito: "${cleanVerdict}..."

Tenta a sorte (se tiver coragem):
${window.location.href}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLinkedInShare = () => {
    const message = `Acabei de descobrir o que os recrutadores realmente pensam do meu CV! 📢 O CV Sincero me deu nota ${score}/10. Será que você tira mais? Teste o seu:`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a imagem.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Gerando imagem...",
        description: "Aguarde um instante.",
      });

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a1a',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `cv-sincero-nota-${score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Imagem baixada! 🎉",
        description: "Agora posta no Stories e marca a gente!",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Erro ao gerar imagem",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 space-y-4"
    >
      <p className="text-center text-sm text-muted-foreground font-medium">
        <Share2 className="w-4 h-4 inline mr-1" />
        Compartilhe seu resultado e desafie os amigos!
      </p>
      
      <div className="flex gap-3 justify-center flex-wrap">
        {/* WhatsApp Button */}
        <Button
          onClick={handleWhatsAppShare}
          className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>

        {/* LinkedIn Button */}
        <Button
          onClick={handleLinkedInShare}
          className="gap-2 bg-[#0A66C2] hover:bg-[#094d92] text-white font-semibold"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>

        {/* Download Image Button */}
        <Button
          onClick={handleDownloadImage}
          variant="outline"
          className="gap-2 border-primary/50 hover:bg-primary/10"
        >
          <Download className="w-4 h-4" />
          Baixar Imagem
        </Button>
      </div>
    </motion.div>
  );
};
