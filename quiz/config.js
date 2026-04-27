var quizJSON = {
  id: "spark_maxx_diagnostico_v3",
  title: "[NOVO] Diagnóstico Spark Maxx",
  nodes: {
    "start": {
      id: "start",
      type: "lead_form",
      title: "Quiz de Diagnóstico — Spark Maxx",
      subtitle: "Em menos de 3 minutos, você recebe um diagnóstico preciso e a solução ideal para o seu momento.",
      fields: [
        { id: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo', required: true, errorMsg: 'Por favor, informe seu nome' },
        { id: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com', required: true, errorMsg: 'Informe um e-mail válido' },
        { id: 'celular', label: 'WhatsApp', type: 'tel', placeholder: '(00) 00000-0000', required: true, errorMsg: 'Informe seu WhatsApp' },
        { id: 'empresa', label: 'Empresa', type: 'text', placeholder: 'Nome da sua empresa', required: true, errorMsg: 'Informe sua empresa' }
      ],
      buttonText: "Começar diagnóstico!",
      next: "perfil"
    },
    "perfil": {
      id: "perfil",
      type: "question",
      tag: "Bloco 2",
      title: "Qual perfil melhor descreve você hoje?",
      subtitle: "Selecione a opção que mais se encaixa com sua atuação profissional",
      options: [
        { id: "A", icon: "🏢", text: "Marca", next: "q2_marca", value: "Marca" },
        { id: "B", icon: "📣", text: "Agência de Publicidade/Marketing", next: "q2_agencia", value: "Agência de Publicidade/Marketing" },
        { id: "C", icon: "🎥", text: "Creator", next: "q2_creator", value: "Creator" },
        { id: "D", icon: "🎯", text: "Agência de Casting / Agenciador", next: "q2_casting", value: "Agência de Casting / Agenciador" }
      ]
    },
    // Fluxo A - Marca
    "q2_marca": {
      id: "q2_marca",
      type: "question",
      tag: "Fluxo Marca",
      title: "Qual sua prioridade estratégica?",
      subtitle: "T3 — Escolha o foco principal do seu momento",
      options: [
        { id: "A", text: "Encontrar novos nichos/comunidades", next: "q3_marca", hint: "cd" },
        { id: "B", text: "Gerir campanhas de influência e encontrar creators", next: "q3_marca", hint: "ss" },
        { id: "C", text: "Analisar reputação dos meus embaixadores", next: "q3_marca", hint: "cp" }
      ]
    },
    "q3_marca": {
      id: "q3_marca",
      type: "question",
      tag: "Fluxo Marca",
      title: "Qual seu maior desafio?",
      subtitle: "T4 — O que mais trava sua operação hoje?",
      options: [
        { id: "A", text: "Audiência genérica e sem dados culturais", next: "analyzing", hint: "cd" },
        { id: "B", text: "Processos manuais e falta de dados em campanhas", next: "analyzing", hint: "ss" },
        { id: "C", text: "Prever riscos de imagem e dados do embaixador", next: "analyzing", hint: "cp" }
      ]
    },
    // Fluxo B - Agência
    "q2_agencia": {
      id: "q2_agencia",
      type: "question",
      tag: "Fluxo Agência",
      title: "O que seu cliente mais espera da agência?",
      subtitle: "T3 — O critério de sucesso mais cobrado",
      options: [
        { id: "A", text: "Inovação: públicos e territórios inexplorados", next: "q3_agencia", hint: "cd" },
        { id: "B", text: "Resultados: gestão de influenciadores e ROI", next: "q3_agencia", hint: "ss" },
        { id: "C", text: "Assertividade: acompanhar reputação dos creators", next: "q3_agencia", hint: "cp" }
      ]
    },
    "q3_agencia": {
      id: "q3_agencia",
      type: "question",
      tag: "Fluxo Agência",
      title: "Qual KPI é mais recorrente nas entregas?",
      subtitle: "T4 — A métrica que não pode faltar nos relatórios",
      options: [
        { id: "A", text: "EMV, CPE, tempo de operação, ROI", next: "analyzing", hint: "ss" },
        { id: "B", text: "CPL, engajamento por comunidade, SoV, Brand Affinity", next: "analyzing", hint: "cd" },
        { id: "C", text: "Aumento de engajamento e parcerias de influenciadores", next: "analyzing", hint: "cp" }
      ]
    },
    // Fluxo C - Creator
    "q2_creator": {
      id: "q2_creator",
      type: "question",
      tag: "Fluxo Creator",
      title: "Como quer potencializar sua carreira?",
      subtitle: "T3 — Seu objetivo de crescimento",
      options: [
        { id: "A", text: "Entender meu público e comunidades", next: "q3_creator", hint: "cp" },
        { id: "B", text: "Provar meu valor para marcas", next: "q3_creator", hint: "cp" },
        { id: "C", text: "Melhorar meu posicionamento", next: "q3_creator", hint: "cp" },
        { id: "D", text: "Atrair mais parcerias", next: "q3_creator", hint: "cp" }
      ]
    },
    "q3_creator": {
      id: "q3_creator",
      type: "question",
      tag: "Fluxo Creator",
      title: "Você utiliza dados para negociar contratos?",
      subtitle: "T4 — Como você embasa suas propostas comerciais",
      options: [
        { id: "A", text: "Não uso", next: "analyzing", hint: "cp" },
        { id: "B", text: "Uso apenas o media kit básico", next: "analyzing", hint: "cp" },
        { id: "C", text: "Quero usar dados de busca e sentimento", next: "analyzing", hint: "cp" }
      ]
    },
    // Fluxo D - Casting
    "q2_casting": {
      id: "q2_casting",
      type: "question",
      tag: "Fluxo Casting",
      title: "Qual a prioridade para o seu casting?",
      subtitle: "T3 — O foco da sua agência de talentos",
      options: [
        { id: "A", text: "Descobrir novos talentos por nicho", next: "q3_casting", hint: "ss" },
        { id: "B", text: "Auditar reputação dos agenciados", next: "q3_casting", hint: "cp" },
        { id: "C", text: "Organizar a operação comercial", next: "q3_casting", hint: "ss" },
        { id: "D", text: "Atrair mais parcerias", next: "q3_casting", hint: "cp" }
      ]
    },
    "q3_casting": {
      id: "q3_casting",
      type: "question",
      tag: "Fluxo Casting",
      title: "O que seus clientes mais pedem?",
      subtitle: "T4 — A maior demanda que chega para você",
      options: [
        { id: "A", text: "Fit cultural e nicho", next: "analyzing", hint: "cp" },
        { id: "B", text: "Prevenção de riscos de imagem", next: "analyzing", hint: "cp" },
        { id: "C", text: "Eficiência e relatórios", next: "analyzing", hint: "ss" },
        { id: "D", text: "Descobrir novos influenciadores", next: "analyzing", hint: "ss" }
      ]
    },
    "analyzing": {
      id: "analyzing",
      type: "loading",
      title: "Gerando diagnóstico personalizado...",
      subtitle: "Cruzando suas prioridades com as soluções do ecossistema Spark Maxx.",
      duration: 3000,
      next: "result"
    },
    "result": {
      id: "result",
      type: "result",
      title: "Seu Diagnóstico de Influência",
      badge: "🔍 Resultado calculado",
      description: "Baseado nas suas respostas, identificamos as ferramentas ideais para escalar sua operação.",
      solutions: [],
      cta: "Agendar conversa com especialista",
      url: "https://sparkmaxx.com.br"
    }
  },
  results: {
    'ss': {
      id: 'ss',
      title: 'Sprout Social Influencer Marketing',
      badge: '📊 Gestão & Escala',
      description: 'Plataforma completa de gestão de influência para agências e marcas que buscam eficiência operacional. Centraliza toda a jornada da campanha — do discovery de creators via IA até contratos e pagamentos — entregando comprovação real do ROI.',
      solutions: [
        { name: 'Gestão Ponta a Ponta', desc: 'Centralize contratos, pagamentos e aprovações.' },
        { name: 'Discovery via IA', desc: 'Encontre os creators certos em segundos.' },
        { name: 'Mensuração de ROI', desc: 'Dados precisos de impacto financeiro e EMV.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cd': {
      id: 'cd',
      title: 'Community Discovery',
      badge: '🗺️ Inteligência de Território',
      description: 'Inteligência de territórios e microcomunidades para times de estratégia e redação. Identifica onde o público conversa e quais são seus códigos de linguagem, conectando marcas a novos mercados de forma autêntica.',
      solutions: [
        { name: 'Mapeamento de Nichos', desc: 'Descubra onde sua audiência realmente está.' },
        { name: 'Análise Cultural', desc: 'Entenda os códigos de linguagem de cada comunidade.' },
        { name: 'Territórios Inexplorados', desc: 'Inovação para marcas que querem sair do óbvio.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cp': {
      id: 'cp',
      title: 'Creator Pulse',
      badge: '🛡️ Saúde & Reputação',
      description: 'Raio-x da saúde digital focado no influenciador e no casting. Monitora tendências de busca, sentimentos e autoridade do creator, profissionalizando o posicionamento comercial com dados técnicos auditados.',
      solutions: [
        { name: 'Auditoria de Reputação', desc: 'Segurança absoluta para marcas e embaixadores.' },
        { name: 'Share of Search', desc: 'Mapeie o desejo de busca da sua audiência.' },
        { name: 'Monitoramento 24/7', desc: 'Alertas de crises e tendências em tempo real.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cd_ss': {
      id: 'cd_ss',
      title: 'Community Discovery + Sprout Social',
      badge: '⚡ Inovação & Escala',
      description: 'A combinação ideal para quem precisa descobrir novos territórios e gerenciar campanhas com alta performance. Você une a inteligência cultural à eficiência operacional.',
      solutions: [
        { name: 'Inteligência e Gestão', desc: 'O melhor do mapeamento com o melhor da operação.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cd_cp': {
      id: 'cd_cp',
      title: 'Community Discovery + Creator Pulse',
      badge: '🛡️ Estratégia Segura',
      description: 'Foco total em encontrar comunidades e garantir a saúde digital da sua marca. Ideal para estratégias de branding e curadoria de embaixadores de longo prazo.',
      solutions: [
        { name: 'Cultura e Segurança', desc: 'Descubra nichos e monitore reputação simultaneamente.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'ss_cp': {
      id: 'ss_cp',
      title: 'Sprout Social + Creator Pulse',
      badge: '📈 Performance & Auditoria',
      description: 'Para operações que não podem errar. Combine a gestão robusta de campanhas com o monitoramento rigoroso de reputação e sentimentos.',
      solutions: [
        { name: 'Gestão e Reputação', desc: 'ROI comprovado com segurança de imagem.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
  }
};
