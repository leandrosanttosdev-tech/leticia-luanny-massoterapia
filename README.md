# Letícia Luanny Massoterapia

Site institucional da **Letícia Luanny Massoterapia**, serviço de massoterapia em Aracaju/SE.

## Sobre o projeto

Landing page de página única, responsiva, que apresenta a profissional, os serviços oferecidos e direciona o visitante para o agendamento via WhatsApp.

### Seções

- **Início** — apresentação e chamada principal para agendamento
- **Sobre** — trajetória e abordagem da profissional
- **Serviços** — massagem relaxante, pedras quentes, liberação miofascial, ventosaterapia e massagem desportiva
- **Diferenciais** — o que torna o atendimento único
- **Contato** — WhatsApp e Instagram

## Tecnologias

- HTML5 semântico
- CSS3 (custom properties, layout responsivo)
- JavaScript (vanilla)
- Google Fonts — Cormorant Garamond e Jost

Sem dependências de build: o site é estático e pode ser servido diretamente.

## Estrutura

```
.
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── hero.jpg
│   │   ├── leticia.jpg
│   │   ├── logo.png
│   │   ├── logo-mark.png
│   │   └── sessao.jpg
│   └── js/
│       ├── analytics.js
│       └── main.js
├── index.html
└── README.md
```

## Executando localmente

Abra o arquivo `index.html` no navegador ou sirva a pasta com um servidor estático:

```bash
npx serve .
# ou
python -m http.server 8000
```

## Fotos e detalhes dos serviços

Cada serviço tem duas fotos em `assets/images/servicos/` (`<servico>-1.jpg` aparece no card, e as duas aparecem no painel "Saiba mais"). As fotos atuais são provisórias, do [Unsplash](https://unsplash.com/license) (uso comercial gratuito); a origem de cada uma está em `assets/images/servicos/CREDITOS.md`. Para trocar pelas fotos reais, basta substituir os arquivos mantendo o mesmo nome — de preferência na horizontal (3:2), com cerca de 960×640 px e até 150 KB.

Os textos do painel (duração, intensidade, "para quem é indicada" e "como é a sessão") ficam no `<template class="svc-details">` de cada card, em `index.html`.

## Métricas

O arquivo `assets/js/analytics.js` integra Google Analytics 4 e Meta Pixel. Para ativar, preencha os IDs em `ANALYTICS_CONFIG`:

```js
var ANALYTICS_CONFIG = {
  ga4Id: 'G-XXXXXXXXXX',
  metaPixelId: '123456789012345'
};
```

Com os IDs vazios, nenhum script externo é carregado. Quando ativo, cada clique em WhatsApp, telefone ou Instagram é registrado como o evento `clique_contato` (GA4) e `Contact` (Meta), com o canal, o botão e a seção de origem.

## Deploy

Por ser um site estático, pode ser publicado em qualquer serviço de hospedagem estática, como GitHub Pages, Netlify ou Vercel.

## Contato

- WhatsApp: [(79) 99803-4464](https://wa.me/5579998034464)
- Instagram: [@luannyfisio_](https://instagram.com/luannyfisio_)

---

© Letícia Luanny Massoterapia. Todos os direitos reservados.
