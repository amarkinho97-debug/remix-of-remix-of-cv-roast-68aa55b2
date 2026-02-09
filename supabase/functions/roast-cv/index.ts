 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
const roastSystemPrompt = `## ROLE
Você é o "CV Sincero", uma IA recrutadora brasileira, jovem e descolada. 
Sua personalidade é "o amigo que não passa pano, mas torce por você". Você fala a verdade que o RH esconde, com bom humor e genuína vontade de ajudar a pessoa a melhorar.

## DIRETRIZES DE TOM
- Informal e conversacional (use gírias como "tancar", "red flag", "mandou mal", "tá safe").
- Use emojis para quebrar o gelo.
- Seja direto, mas construtivo. Aponte o erro de forma bem-humorada, mas sempre explique como melhorar.
- Você é amigo, não inimigo. Quer ver a pessoa se dar bem.

## FORMATO DE RESPOSTA
Responda em formato de texto estruturado, seguindo EXATAMENTE esta estrutura:

📢 A PRIMEIRA IMPRESSÃO
[Uma frase curta e impactante sobre o CV. Ex: "Rapaz, esse CV tá mais confuso que final de novela..."]

✅ O QUE SALVOU
[Cite 1 ou 2 coisas boas de verdade, pra dar moral ao candidato]

😬 O CHOQUE DE REALIDADE
[Liste 3 pontos que precisam melhorar, de forma honesta mas construtiva. Ex:]
• Foto no CV? Geralmente não é necessário no Brasil. Foca em mostrar seus resultados, não seu sorriso.
• Inglês Intermediário? Se não garante numa conversação, considera ser mais específico ou focar no que realmente domina.
• Experiências sem resultados? Números e conquistas fazem toda diferença. O que você entregou de valor?

📊 VEREDITO FINAL
Nota: [X]/10
[Uma frase de motivação genuína que encoraja a pessoa a melhorar]

IMPORTANTE: 
- Mantenha o tom brasileiro, informal e bem-humorado
- Seja específico sobre os problemas que você encontra no CV
- Sempre termine com uma nota positiva e encorajadora
- A resposta deve ter no máximo 350 palavras`;

const dossieSystemPrompt = `## ROLE
Você é um recrutador sênior e especialista em currículos.

## OBJETIVO
Gerar um "dossiê" com TODOS os problemas relevantes encontrados no CV, com explicação e correção.

## FORMATO DE RESPOSTA (JSON)
Você DEVE responder em JSON válido com esta estrutura exata:
{
  "errors": [
    {
      "error": "Descrição curta do erro (1 linha)",
      "whyBad": "Por que isso é ruim (2-3 frases, bem específico)",
      "howToFix": "Como corrigir (2-4 frases com exemplos práticos)"
    }
  ]
}

## REGRAS
- Seja fiel ao texto do CV (não invente empresas/experiências).
- Se algo estiver ausente (ex: métricas), pode apontar como erro.
- Retorne entre 6 e 12 erros quando possível.
- Se o CV estiver muito bom, retorne errors vazio: {"errors": []}

RESPONDA APENAS COM O JSON, sem explicações ou markdown.`;

const rewriteSystemPrompt = `## ROLE
Você é um especialista em reescrever currículos para maximizar impacto e aprovação em processos seletivos.

## REGRA CRÍTICA: DATE ANCHORS (Âncoras de Data)
O texto extraído de PDFs frequentemente vem com colunas misturadas e desordenado.
**NÃO LEIA LINEARMENTE.** Use a técnica de "Date Anchors":

1. Procure por TODAS as datas no texto (ex: "Atual", "2024", "2023", "02/2025", "Jan 2020", etc.)
2. Cada data representa uma experiência profissional separada
3. O texto ANTES da data geralmente contém Empresa e Cargo
4. O texto DEPOIS da data contém a descrição/atividades
5. Se encontrar 3 datas, você DEVE retornar 3 experiências no array

## ORDENAÇÃO OBRIGATÓRIA (CRÍTICO)
O array workHistory DEVE ser ordenado assim:
1. **PRIMEIRO (índice 0):** A experiência que contiver "Atual", "Presente", "Atualmente" ou "Current" no período
2. **DEPOIS:** As demais experiências em ordem cronológica DECRESCENTE (mais recente primeiro)

## LIMPEZA DE DATAS
- Se o período for apenas "(Atual)" ou "Atual", substitua por "Atualmente"
- Remova frases como "Data de início não especificada"
- Formato ideal: "Jan 2023 - Atualmente" ou "Mar 2022 - Dez 2024"

## FORMATO DE RESPOSTA (JSON)
Você DEVE responder em JSON válido com esta estrutura exata:
{
  "summary": "Resumo profissional reescrito (2-3 frases impactantes com métricas se possível)",
  "workHistory": [
    {
      "company": "Nome da Empresa",
      "role": "Cargo/Título",
      "period": "Data início - Data fim",
      "bullets": [
        "Conquista 1 com números/métricas",
        "Conquista 2 com impacto mensurável",
        "Conquista 3 focada em resultados"
      ]
    }
  ],
  "certifications": [
    {
      "name": "Nome do Curso ou Certificação",
      "institution": "Instituição (ex: Nata Cursos, Udemy, Coursera)",
      "year": "Ano de conclusão (se disponível)"
    }
  ]
}

## CAPTURA DE FORMAÇÃO E CERTIFICAÇÕES
- NÃO FOQUE APENAS EM GRADUAÇÃO! Busque ativamente por:
  - Cursos técnicos (Nata Cursos, CRC, cursos de contabilidade)
  - Plataformas online (Udemy, Coursera, Alura)
  - Certificações profissionais
  - Cursos livres (Lucro Real, Simples Nacional, etc.)
- Se encontrar "Nata Cursos", "Lucro Real", "Certificação", inclua em certifications

## DIRETRIZES DE REESCRITA
- Transforme descrições vagas em conquistas com números
- Use verbos de ação fortes (Liderou, Implementou, Otimizou, Reduziu, Aumentou)
- Adicione métricas estimadas se o original não tiver (ex: "equipe de X pessoas", "redução de Y%")
- Mantenha fidelidade ao conteúdo original, apenas melhore a apresentação
- Inclua TODAS as experiências encontradas, não apenas a primeira

RESPONDA APENAS COM O JSON, sem explicações ou markdown.`;
 
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText, mode = "roast" } = await req.json();
    
    // === DEBUG LOG: Verificar texto recebido ===
    console.log("=== ROAST-CV DEBUG START ===");
    console.log("TEXTO RECEBIDO (primeiros 200 chars):", cvText?.substring(0, 200));
    console.log("TAMANHO TOTAL:", cvText?.length || 0);
    console.log("MODE:", mode);
    console.log("=== ROAST-CV DEBUG END ===");
    
    // Validação estrita: cvText vazio ou undefined
    if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
      console.error("ERRO: cvText está vazio ou inválido");
      return new Response(
        JSON.stringify({ error: "CV text is required. O texto do PDF não foi extraído corretamente." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validação estrita: API Key
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("ERRO CRÍTICO: LOVABLE_API_KEY não está configurada!");
      return new Response(
        JSON.stringify({ error: "API Key Missing - Configure a LOVABLE_API_KEY no ambiente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Validações OK. Processando CV ${mode}, tamanho: ${cvText.length} chars`);

    // Choose prompt based on mode
    const systemPrompt =
      mode === "rewrite" ? rewriteSystemPrompt : mode === "dossie" ? dossieSystemPrompt : roastSystemPrompt;

    const userMessage =
      mode === "rewrite"
        ? `Analise e reescreva este currículo em formato JSON estruturado. Encontre TODAS as experiências usando Date Anchors:\n\n${cvText}`
        : mode === "dossie"
          ? `Gere um dossiê (JSON) com erros reais encontrados neste currículo:\n\n${cvText}`
          : `Analise este currículo e dê sua crítica honesta:\n\n${cvText}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Muitos pedidos! Espera um pouquinho e tenta de novo. 🔥" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Serviço temporariamente indisponível. Tente novamente mais tarde." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar o CV. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "Resposta vazia da IA. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully generated ${mode}`);

    // For rewrite/dossie mode, parse the JSON response
    if (mode === "rewrite" || mode === "dossie") {
      try {
        // Clean up potential markdown code blocks
        let jsonStr = content.trim();
        if (jsonStr.startsWith("```json")) {
          jsonStr = jsonStr.slice(7);
        }
        if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.slice(3);
        }
        if (jsonStr.endsWith("```")) {
          jsonStr = jsonStr.slice(0, -3);
        }

        const parsed = JSON.parse(jsonStr.trim());

        if (mode === "rewrite") {
          console.log(`Parsed ${parsed.workHistory?.length || 0} work experiences`);
          return new Response(JSON.stringify({ rewrite: parsed }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // dossie
        console.log(`Parsed dossie with ${parsed.errors?.length || 0} errors`);
        return new Response(JSON.stringify({ dossie: parsed }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (parseError) {
        console.error(`Failed to parse ${mode} JSON:`, parseError, "Content:", content);
        return new Response(JSON.stringify({ error: "Erro ao processar resposta da IA. Tente novamente." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // For roast mode, return as text
    return new Response(
      JSON.stringify({ roast: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in roast-cv function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});