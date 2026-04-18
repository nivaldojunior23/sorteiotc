# Sorteador Inteligente - ADCIN Templo Central

Uma aplicação web projetada para a **ADCIN Templo Central**. Este Sorteador Inteligente foi meticulosamente construído para operar em eventos presenciais e cultos rotineiros da igreja, com o foco em entregar sorteios de números (bingos, prêmios) de maneira dinâmica, responsiva e com alta performance de exibição no telão. 

O projeto adota de ponta-a-ponta as especificidades visuais e cromáticas da identidade do site oficial.

## 🌟 Visão Geral e Recursos

*   **Design Glassmorphism Premium**: Interface limpa e minimalista usando blocos translúcidos e fundo em gradiente obscuro/claro que reflete luxuosidade e acessibilidade visual em grandes distâncias.
*   **Resultados em Foco Individual**: Resultados do sorteio não se misturam. Cada número é realçado dentro do seu próprio "Cartão" brilhante, garantindo leitura instantânea ao público, ideais para sorteios em massa.
*   **Sistemas Flexíveis:** Sorteio dinâmico que possibilita **escolher a quantidade de números**, definir o espaço `Mínimo` e `Máximo`, e opção fundamental de **Não Repetir os Números Sorteados**.
*   **Celebração e Efeitos:** Confetes estilizados com a paleta de cores ADCIN, transições polidas e contagem regressiva tensa para manter a igreja fisgada no resultado.
*   **Histórico Persistente:** Mantenha registro dos últimos sorteios atrelados ao dispositivo de forma automática (`localStorage`), ótimo para reconfirmações pós-sorteio.
*   **Suporte Perfeito a Modo Escuro/Claro:** Layout *mobile-friendly* forçado em Modo Escuro de alto contraste (para telão), mas com transição fluída via chave para uso do locutor em Modo Claro brilhante.

## 🚀 Tecnologias Integradas

O projeto foi construído para durabilidade de ponta:

*   **React 18** (ViteJS Bundler) 
*   **TypeScript** (Sintaxe rigorosamente tipada)
*   **Tailwind CSS V4** (Otimizado via CSS Variables, sem conflitos nativos)
*   **Canvas Confetti** (Motor matemático 3D leve de disparo de confetes)

## 💻 Instalação Local e Uso

Para executar e desenvolver melhorias adicionais no código localmente:

1. Modifique ou reabra este diretório no seu console/terminal da escolha.
2. Certifique-se que o pacote de bibliotecas de dependência originais está fresco e limpo utilizando: 
   ```bash
   npm install
   ```
3. Ative o servidor de desenvolvimento ultra-rápido:
   ```bash
   npm run dev
   ```
4. Navegue até o destino revelado no terminal (`http://localhost:5173/`).

## 🧱 Como Gerar a Publicação

Quando este projeto estiver pronto para ser colocado no ar ("deployado" via Netlify/Vercel/Cloudflare) utilize:
```bash
npm run build
```
O sistema unificará e enxugará a árvore inteira numa pequena pasta chamada **`dist`**. Envie apenas esta pasta para a internet.

---
**Nota Dev:** *Certifique-se de que nenhum software apague seus botões e inputs ao dar git reset. Tudo já está salvo no seu rastreio local agora!*
