# AUTOCORE — Site de Mecânica Automotiva Premium

Site completo, responsivo e otimizado para conversão (agendamentos + WhatsApp),
construído a partir do PRD **Dark Automotive Premium**.

Sem build, sem dependências: basta abrir `index.html` no navegador.

---

## 📁 Estrutura

```
Criador de Sites/
├── index.html            ← página única (todo o conteúdo)
├── assets/
│   ├── css/styles.css    ← estilos customizados + animações
│   └── js/script.js      ← interações (menu, slider, form, contadores)
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## ▶️ Como visualizar

1. Abra `index.html` diretamente no navegador (duplo clique), **ou**
2. Rode um servidor local para simular produção:

```bash
cd "Criador de Sites"
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

> Observação: o Tailwind é carregado via CDN. É a forma mais simples de
> editar; para publicar em produção, recomenda-se migrar para Tailwind
> compilado (o site continua funcionando perfeitamente no CDN).

---

## ✏️ O que editar antes de publicar

### 1. WhatsApp (mais importante)

Em `assets/js/script.js`, topo do arquivo:

```js
const SITE = {
  whatsapp: '5511999999999',   // 55 + DDD + número
  whatsappDefault: 'Olá! Gostaria de solicitar um orçamento para meu veículo.',
};
```

Também atualize os links `href="https://wa.me/5511999999999"` em
`index.html` (botão do header, CTA final, formulário e rodapé) — ou deixe
todos apontando para o mesmo número.

### 2. Contatos e endereço

Procure no `index.html` por:

- `Av. Exemplo, 1000 — Centro, São Paulo/SP`
- `(11) 3456-7890`
- `contato@autocore.com.br`

Também no bloco **JSON-LD** (dados estruturados) no `<head>`:
`streetAddress`, `telephone`, etc.

### 3. Números / prova social

Na seção **NÚMEROS / PROVA SOCIAL** do `index.html`:

```html
<span data-count="10" data-suffix="+">0</span>      <!-- anos -->
<span data-count="2500" data-suffix="+">0</span>    <!-- veículos -->
<span data-count="98" data-suffix="%">0</span>      <!-- satisfação -->
<span data-count="15" data-suffix="+">0</span>      <!-- serviços -->
```

> ⚠️ Nunca publique números inventados para um cliente real.

### 4. Conteúdo demonstrativo (substituir por conteúdo real)

- **Depoimentos** (nomes, fotos, textos)
- **Slider Antes/Depois** — trocar as duas imagens por fotos reais do
  mesmo veículo, alinhadas entre si (as tags `<img>` ficam na seção
  RESULTADOS)
- **Marcas atendidas** — manter apenas marcas que a empresa realmente atenda
- **Nome da empresa** — "AUTOCORE" é provisório (logo, title, JSON-LD, footer)

### 5. Imagens

Todas vêm do Unsplash (licença livre, uso comercial permitido) via
`images.unsplash.com`, com `auto=format` (serve WebP/AVIF automaticamente),
`loading="lazy"` e `srcset` responsivo.

**Crédito obrigatório:** o card de FREIOS usa a foto
"Porsche Panamera Turbo S" do Wikimedia Commons, autor *InSapphoWeTrust*,
licença **CC BY-SA 2.0** — mantenha o crédito ou troque a imagem.

Para trocar: localize a tag `<img>` e substitua a URL. Para produção,
recomenda-se hospedar as fotos finais no próprio projeto/CDN.

### 6. SEO

- `title` e `meta description` no `<head>`
- `canonical`, `og:url` e URLs do `sitemap.xml` / `robots.txt`
  usam `https://www.autocore.com.br/` como exemplo — atualize o domínio.

---

## 🧩 Seções do site

| # | Seção | ID |
|---|-------|----|
| 1 | Header sticky (blur no scroll) | — |
| 2 | Hero fullscreen | `#inicio` |
| 3 | Serviços (4 cards + lista completa) | `#servicos` |
| 4 | Diferenciais | `#diferenciais` |
| 5 | Sobre a empresa | `#sobre` |
| 6 | Números / prova social | — |
| 7 | Antes e depois (slider interativo) | `#resultados` |
| 8 | Depoimentos (carousel no mobile) | `#depoimentos` |
| 9 | Marcas atendidas (marquee) | `#marcas` |
| 10 | CTA final | — |
| 11 | Formulário de agendamento | `#agendar` |
| 12 | Contato direto (sidebar) | `#contato` |
| 13 | Footer | `#rodape` |
| 14 | WhatsApp flutuante | — |

---

## 📱 Comportamento

- **Mobile-first**: 1 coluna no mobile, 2 no tablet, 4 no desktop
- **CTA sempre visível**: header, hero, serviços, CTA final, formulário,
  footer e WhatsApp flutuante
- **Formulário**: valida no navegador, mostra confirmação e prepara
  resumo pronto para envio pelo WhatsApp (sem backend)
- **Animações discretas**: fade/slide no scroll, zoom em imagens, brilho
  nos botões, parallax leve no hero — respeitando
  `prefers-reduced-motion`
- **Acessibilidade**: contraste alto, `alt` nas imagens, labels nos
  campos, navegação por teclado (slider de antes/depois aceita setas),
  estados de foco visíveis

---

## 🚀 Publicar

**Opção 1 — Estático (atual):** envie a pasta para Vercel, Netlify,
Cloudflare Pages ou qualquer hospedagem. Funciona sem alterações.

**Opção 2 — Evoluir:** migrar para Next.js + Supabase conforme o PRD
(seção 26), mantendo o visual — os estilos e a estrutura de seções se
mantêm os mesmos.

---

## ⚙️ SEO incluído

- `title`, `meta description`, Open Graph e Twitter Card
- H1 único ("Seu carro. Nossa experiência.") + H2 semânticos
- Dados estruturados **Schema.org AutoRepair** (endereço, telefone, horários)
- `robots.txt` + `sitemap.xml`
- Favicon SVG
