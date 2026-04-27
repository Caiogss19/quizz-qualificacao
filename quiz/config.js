var quizJSON = {
  id: "spark_maxx_diagnostico_v7_final_texts",
  title: "[FINAL] Diagnóstico Spark Maxx",
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
        { id: "A", icon: "🏢", text: "Marca", next: "q2_empresa", value: "Marca" },
        { id: "B", icon: "📣", text: "Agência", next: "q2_agencia", value: "Agência" },
        { id: "C", icon: "🎥", text: "Creator", next: "q2_creator", value: "Creator" },
        { id: "D", icon: "🎯", text: "Casting / Agenciador", next: "q2_casting", value: "Casting" }
      ]
    },
    // 3A. Fluxo Marca
    "q2_empresa": {
      id: "q2_empresa",
      type: "question",
      tag: "Fluxo Marca",
      title: "Qual é a sua prioridade estratégica com influencer marketing?",
      subtitle: "T3 — Prioridade estratégica",
      options: [
        { id: "A", text: "Identificar novos nichos e criadores alinhados", next: "q3_empresa", hint: "cd" },
        { id: "B", text: "Gerir campanhas e medir ROI de forma centralizada", next: "q3_empresa", hint: "ss" },
        { id: "C", text: "Proteger e monitorar a reputação da marca", next: "q3_empresa", hint: "cp" }
      ]
    },
    "q3_empresa": {
      id: "q3_empresa",
      type: "question",
      tag: "Fluxo Marca",
      title: "Qual é o seu maior desafio operacional hoje?",
      subtitle: "T4 — Desafio operacional",
      options: [
        { id: "A", text: "Encontrar os criadores certos para cada campanha", next: "analyzing", hint: "cd" },
        { id: "B", text: "Controlar contratos, pagamentos e fluxo operacional", next: "analyzing", hint: "ss" },
        { id: "C", text: "Monitorar riscos e garantir a segurança da marca", next: "analyzing", hint: "cp" }
      ]
    },
    // 3B. Fluxo Agência
    "q2_agencia": {
      id: "q2_agencia",
      type: "question",
      tag: "Fluxo Agência",
      title: "Qual é o principal foco de entrega aos seus clientes?",
      subtitle: "T3 — Foco de entrega",
      options: [
        { id: "A", text: "Campanhas com ROI e resultados comprovados", next: "q3_agencia", hint: "ss" },
        { id: "B", text: "Planejamento estratégico e mapeamento de audiências", next: "q3_agencia", hint: "cd" },
        { id: "C", text: "Auditoria, compliance e segurança dos influencers", next: "q3_agencia", hint: "cp" }
      ]
    },
    "q3_agencia": {
      id: "q3_agencia",
      type: "question",
      tag: "Fluxo Agência",
      title: "Qual é o principal gargalo para escalar a agência?",
      subtitle: "T4 — Gargalo de escala",
      options: [
        { id: "A", text: "Contratação e gestão eficiente de influencers", next: "analyzing", hint: "ss" },
        { id: "B", text: "Insights de mercado e inteligência competitiva", next: "analyzing", hint: "cd" },
        { id: "C", text: "Monitoramento contínuo e relatórios de risco", next: "analyzing", hint: "cp" }
      ]
    },
    // 3C. Fluxo Creator
    "q2_creator": {
      id: "q2_creator",
      type: "question",
      tag: "Fluxo Creator",
      title: "Qual é o seu principal objetivo de carreira agora?",
      subtitle: "T3 — Objetivo de carreira",
      options: [
        { id: "A", text: "Crescer meu alcance e métricas de engajamento", next: "q3_creator", hint: "ss" },
        { id: "B", text: "Dominar meu nicho e fortalecer posicionamento", next: "q3_creator", hint: "cd" },
        { id: "C", text: "Proteger minha imagem e reputação digital", next: "q3_creator", hint: "cp" }
      ]
    },
    "q3_creator": {
      id: "q3_creator",
      type: "question",
      tag: "Fluxo Creator",
      title: "Como você usa dados ao apresentar propostas para marcas?",
      subtitle: "T4 — Uso de dados",
      options: [
        { id: "A", text: "Ainda não incluo dados nas minhas propostas", next: "analyzing", hint: "cp" },
        { id: "B", text: "Uso métricas básicas de alcance e visualizações", next: "analyzing", hint: "ss" },
        { id: "C", text: "Uso análises avançadas de audiência e nicho", next: "analyzing", hint: "cd" }
      ]
    },
    // 3D. Fluxo Casting
    "q2_casting": {
      id: "q2_casting",
      type: "question",
      tag: "Fluxo Casting",
      title: "Qual é a maior prioridade no seu trabalho de casting?",
      subtitle: "T3 — Prioridade de casting",
      options: [
        { id: "A", text: "Descobrir e mapear novos talentos e criadores", next: "q3_casting", hint: "cd" },
        { id: "B", text: "Proteger a reputação e imagem dos agenciados", next: "q3_casting", hint: "cp" },
        { id: "C", text: "Escalar a operação de contratos e campanhas", next: "q3_casting", hint: "ss" }
      ]
    },
    "q3_casting": {
      id: "q3_casting",
      type: "question",
      tag: "Fluxo Casting",
      title: "O que seus clientes mais demandam nas contratações?",
      subtitle: "T4 — Demanda dos clientes",
      options: [
        { id: "A", text: "Fit cultural e alinhamento de valores com a marca", next: "analyzing", hint: "cd" },
        { id: "B", text: "Gestão de riscos e histórico de imagem limpo", next: "analyzing", hint: "cp" },
        { id: "C", text: "Relatórios de desempenho e resultados anteriores", next: "analyzing", hint: "ss" }
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
      badge: '📊 Operação e Performance',
      description: 'Você precisa de uma plataforma centralizada para gerir campanhas, contratos e medir ROI de influencer marketing. A ferramenta indicada é o Sprout Social — solução completa para operação, pagamentos e performance.',
      solutions: [
        { name: 'Gestão de Campanhas', desc: 'Centralize contratos, pagamentos e aprovações de forma escalável.' },
        { name: 'Controle Financeiro', desc: 'Gestão completa de pagamentos e fluxos operacionais.' },
        { name: 'Métricas e ROI', desc: 'Dados precisos de impacto financeiro e performance em tempo real.' },
        { name: 'Dashboard de Performance', desc: 'Visão holística dos resultados de todos os seus influenciadores.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cd': {
      id: 'cd',
      title: 'Community Discovery',
      badge: '🗺️ Inteligência de Comunidades',
      description: 'Você precisa de inteligência para mapear nichos, territórios e microcomunidades e encontrar os criadores certos por afinidade real. A ferramenta indicada é o Community Discovery — motor de descoberta e mapeamento de audiências.',
      solutions: [
        { name: 'Mapeamento de Nichos', desc: 'Descubra onde sua audiência realmente conversa e interage.' },
        { name: 'Descoberta por Afinidade', desc: 'Encontre criadores que realmente possuem fit cultural com a marca.' },
        { name: 'Inteligência de Audiência', desc: 'Entenda os códigos de linguagem e comportamento de cada território.' },
        { name: 'Análise de Microcomunidades', desc: 'Saia do óbvio e conecte-se com públicos altamente engajados.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cp': {
      id: 'cp',
      title: 'Creator Pulse',
      badge: '🛡️ Segurança e Reputação',
      description: 'Você precisa de uma camada de segurança, auditoria de imagem e gestão de riscos sobre os criadores com quem trabalha. A ferramenta indicada é o Creator Pulse — monitoramento de reputação, histórico e compliance.',
      solutions: [
        { name: 'Auditoria de Imagem', desc: 'Raio-x completo do histórico e comportamento digital do influencer.' },
        { name: 'Monitoramento de Riscos', desc: 'Alertas em tempo real sobre possíveis crises de imagem.' },
        { name: 'Compliance de Influencers', desc: 'Garanta que seus embaixadores estejam alinhados com seus valores.' },
        { name: 'Proteção da Marca', desc: 'Segurança absoluta para investimentos de longo prazo em influência.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cd_ss': {
      id: 'cd_ss',
      title: 'Combo Inovação',
      badge: '⚡ Inteligência e Performance',
      description: 'Você tem necessidades em dois eixos: inteligência de nichos e gestão de campanhas com ROI. As ferramentas indicadas são o Community Discovery (para descoberta e mapeamento) + Sprout Social (para operação e performance).',
      solutions: [
        { name: 'Descoberta + Gestão', desc: 'Inteligência de nichos combinada com eficiência operacional.' },
        { name: 'ROI com Inteligência', desc: 'Mensure resultados com base em dados reais de audiência.' },
        { name: 'Planejamento e Performance', desc: 'Estratégia cultural unida à execução impecável.' },
        { name: 'Operação Escalável', desc: 'Cresça sua estratégia de influência com dados e automação.' }
      ],
      cta: 'Agendar conversa with especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'cd_cp': {
      id: 'cd_cp',
      title: 'Combo Estratégia Segura',
      badge: '🛡️ Estratégia Cultural Segura',
      description: 'Você tem necessidades em dois eixos: inteligência de nichos e segurança e auditoria de imagem. As ferramentas indicadas são o Community Discovery (para descoberta e mapeamento) + Creator Pulse (para reputação e compliance).',
      solutions: [
        { name: 'Cultura e Segurança', desc: 'Descubra novos territórios com a garantia de compliance total.' },
        { name: 'Curadoria com Proteção', desc: 'Encontre embaixadores e monitore sua saúde digital 24/7.' },
        { name: 'Branding com Compliance', desc: 'Posicionamento autêntico com gestão rigorosa de riscos.' },
        { name: 'Nichos com Auditoria', desc: 'Explore comunidades com a segurança de dados auditados.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    },
    'ss_cp': {
      id: 'ss_cp',
      title: 'Combo Performance Auditada',
      badge: '📈 Performance com Segurança',
      description: 'Você tem necessidades em dois eixos: gestão de campanhas com ROI e segurança e auditoria de imagem. As ferramentas indicadas são o Sprout Social (para operação e performance) + Creator Pulse (para reputação e compliance).',
      solutions: [
        { name: 'ROI + Compliance', desc: 'Resultados comprovados com total segurança de imagem.' },
        { name: 'Campanhas Monitoradas', desc: 'Gestão de embaixadores com monitoramento de riscos em tempo real.' },
        { name: 'Performance Auditada', desc: 'Dados de performance cruzados com sentimentos e autoridade.' },
        { name: 'Segurança e Resultados', desc: 'Eficiência operacional sem abrir mão da reputação da marca.' }
      ],
      cta: 'Agendar conversa com especialista',
      url: 'https://sparkmaxx.com.br'
    }
  }
};
