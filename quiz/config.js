var quizJSON = {
  id: "spark_maxx_diagnostico",
  title: "[FINAL] Diagnóstico Spark Maxx",
  nodes: {
    "start": {
      id: "start",
      type: "lead_form",
      tag: "Dados",
      title: "Quiz Spark Maxx",
      subtitle: "Descubra a solução ideal para a sua operação.",
      fields: [
        { id: 'nome',    label: 'Nome',     type: 'text',  placeholder: 'Seu nome completo', required: true },
        { id: 'email',   label: 'E-mail',   type: 'email', placeholder: 'seu@email.com',     required: true },
        { id: 'celular', label: 'WhatsApp', type: 'tel',   placeholder: '(11) 99999-9999',   required: true },
        { id: 'empresa', label: 'Empresa',  type: 'text',  placeholder: 'Nome da empresa',   required: false },
      ],
      buttonText: "Começar diagnóstico",
      next: "perfil"
    },
    "perfil": {
      id: "perfil",
      type: "question",
      tag: "Perfil",
      title: "Antes de começar — quem é você?",
      subtitle: "Escolha o perfil que melhor representa sua atuação.",
      varName: "perfil",
      options: [
        { text: 'Marca',                value: 'marca',   hint: null, next: 'q2_empresa' },
        { text: 'Agência',              value: 'agencia', hint: null, next: 'q2_agencia' },
        { text: 'Creator',              value: 'creator', hint: null, next: 'q2_creator' },
        { text: 'Casting / Agenciador', value: 'casting', hint: null, next: 'q2_casting' },
      ]
    },
    "q2_empresa": {
      id: "q2_empresa",
      type: "question",
      tag: "Diagnóstico",
      title: "Qual é a sua prioridade estratégica com influencer marketing?",
      subtitle: "Escolha a opção que melhor descreve o seu foco atual.",
      varName: "q2",
      options: [
        { text: "Identificar novos nichos e criadores alinhados", next: "q3_empresa", hint: "cd" },
        { text: "Gerir campanhas e medir ROI de forma centralizada", next: "q3_empresa", hint: "ss" },
        { text: "Proteger e monitorar a reputação de influenciadores", next: "q3_empresa", hint: "cp" }
      ]
    },
    "q3_empresa": {
      id: "q3_empresa",
      type: "question",
      tag: "Diagnóstico",
      title: "Qual é sua maior dor no dia-a-dia?",
      subtitle: "Escolha a opção mais próxima da sua realidade.",
      varName: "q3",
      options: [
        { text: "Nichos saturados e creators sem fit com a marca", next: "analyzing", hint: "cd" },
        { text: "Falta de dados e gestão de multiplas campanhas", next: "analyzing", hint: "ss" },
        { text: "Monitorar a reputação dos creators/embaixadores", next: "analyzing", hint: "cp" }
      ]
    },
    "q2_agencia": {
      id: "q2_agencia",
      type: "question",
      tag: "Diagnóstico",
      title: "Qual é o principal foco de entrega aos seus clientes?",
      subtitle: "Escolha a opção que melhor representa seu trabalho.",
      varName: "q2",
      options: [
        { text: "Campanhas com ROI e resultados comprovados", next: "q3_agencia", hint: "ss" },
        { text: "Análise de público-alvo e mapeamento de nichos", next: "q3_agencia", hint: "cd" },
        { text: "Auditoria, compliance e segurança dos influencers", next: "q3_agencia", hint: "cp" }
      ]
    },
    "q3_agencia": {
      id: "q3_agencia",
      type: "question",
      tag: "Diagnóstico",
      title: "Qual é o principal gargalo para escalar a agência?",
      subtitle: "Escolha o que mais trava o seu crescimento hoje.",
      varName: "q3",
      options: [
        { text: "Contratação e gestão eficiente de influencers", next: "analyzing", hint: "ss" },
        { text: "Monitoramento de crescimento orgãnico no mercado", next: "analyzing", hint: "cd" },
        { text: "Monitoramento contínuo de perfis de creators", next: "analyzing", hint: "cp" }
      ]
    },
    "q2_creator": {
      id: "q2_creator",
      type: "question",
      tag: "Diagnóstico",
      title: "Qual é o seu principal objetivo de carreira agora?",
      subtitle: "Escolha a opção que mais define sua meta atual.",
      varName: "q2",
      options: [
        { text: "Crescer meu alcance e métricas de engajamento", next: "q3_creator", hint: "cp" },
        { text: "Dominar meu nicho e fortalecer posicionamento", next: "q3_creator", hint: "cp" },
        { text: "Proteger minha imagem e reputação digital", next: "q3_creator", hint: "cp" }
      ]
    },
    "q3_creator": {
      id: "q3_creator",
      type: "question",
      tag: "Diagnóstico",
      title: "Como você usa dados ao apresentar propostas para marcas?",
      subtitle: "Seja honesto — isso define sua solução ideal.",
      varName: "q3",
      options: [
        { text: "Ainda não incluo dados nas minhas propostas", next: "analyzing", hint: "cp" },
        { text: "Uso métricas básicas de alcance e visualizações", next: "analyzing", hint: "cp" },
        { text: "Uso análises avançadas de audiência e nicho", next: "analyzing", hint: "cp" }
      ]
    },
    "q2_casting": {
      id: "q2_casting",
      type: "question",
      tag: "Diagnóstico",
      title: "Qual é a maior prioridade no seu trabalho de casting?",
      subtitle: "Escolha o que mais define sua atuação diária.",
      varName: "q2",
      options: [
        { text: "Descobrir e mapear novos talentos e criadores", next: "q3_casting", hint: "ss" },
        { text: "Proteger a reputação e imagem dos agenciados", next: "q3_casting", hint: "cp" },
        { text: "Conquistar novas parcerias/publis", next: "q3_casting", hint: "cp" }
      ]
    },
    "q3_casting": {
      id: "q3_casting",
      type: "question",
      tag: "Diagnóstico",
      title: "O que seus clientes mais demandam nas contratações?",
      subtitle: "Escolha o que aparece com mais frequência nas negociações.",
      varName: "q3",
      options: [
        { text: "Fit cultural e alinhamento de values com a marca", next: "analyzing", hint: "cp" },
        { text: "Gestão de riscos e histórico de imagem limpo", next: "analyzing", hint: "cp" },
        { text: "Relatórios de desempenho e resultados anteriores", next: "analyzing", hint: "ss" }
      ]
    },
    "analyzing": {
      id: "analyzing",
      type: "loading",
      title: "Analisando suas respostas",
      subtitle: "Cruzando seu perfil com nossa base de soluções martech curadas.",
      duration: 3000,
      next: "result"
    },
    "result": {
      id: "result",
      type: "result"
    }
  },
  results: {
    'ss': {
      badge: 'Resultado puro (2–0)',
      title: 'Sprout Social',
      subtitle: 'Operação e Performance',
      description: 'Você precisa de uma plataforma centralizada para gerir campanhas, contratos e medir ROI de influencer marketing. A ferramenta indicada é o Sprout Social — solução completa para operação, pagamentos e performance.',
      solutions: [
        { name: 'Gestão centralizada de campanhas' },
        { name: 'Controle de contratos e pagamentos' },
        { name: 'Métricas e ROI em tempo real' },
        { name: 'Dashboard de performance' },
        { name: 'Encontrar influenciadores por IA' }
      ],
      cta: 'Agendar conversa com especialista',
      url: '#'
    },
    'cd': {
      badge: 'Resultado puro (2–0)',
      title: 'Community Discovery',
      subtitle: 'Inteligência de Comunidades',
      description: 'Você precisa de inteligência para mapear nichos, territórios e microcomunidades e encontrar os criadores certos por afinidade real. A ferramenta indicada é o Community Discovery — motor de descoberta e mapeamento de audiências.',
      solutions: [
        { name: 'Mapeamento de nichos e novos territórios' },
        { name: 'Descoberta de criadores por afinidade' },
        { name: 'Análise do público-alvo' },
        { name: 'Monitoramento de crescimento orgãnico nos nichos' }
      ],
      cta: 'Agendar conversa com especialista',
      url: '#'
    },
    'cp': {
      badge: 'Resultado puro (2–0)',
      title: 'Creator Pulse',
      subtitle: 'Segurança e Reputação',
      description: 'Você precisa de uma camada de segurança, auditoria de imagem e gestão de riscos sobre os criadores com quem trabalha. A ferramenta indicada é o Creator Pulse — monitoramento de reputação, histórico e compliance.',
      solutions: [
        { name: 'Auditoria de imagem e histórico' },
        { name: 'Monitoramento de riscos em tempo real' },
        { name: 'Identificação de atributos e temas associados ao creator' },
        { name: 'Relatórios que agregam valor para novos contratos' }
      ],
      cta: 'Agendar conversa com especialista',
      url: '#'
    },
    'cd_ss': {
      badge: 'Resultado misto (1–1)',
      title: 'Combo Inovação',
      subtitle: 'Inteligência e Performance',
      description: 'Você tem necessidades em dois eixos: inteligência de nichos e gestão de campanhas com ROI. As ferramentas indicadas são o Community Discovery (para descoberta e mapeamento) + Sprout Social (para operação e performance).',
      solutions: [
        { name: 'Descoberta de nichos + gestão de campanhas' },
        { name: 'ROI com inteligência de audiência' },
        { name: 'Planejamento estratégico e performance' },
        { name: 'Operação escalável com influenciadores com match real' }
      ],
      cta: 'Agendar conversa com especialista',
      url: '#'
    },
    'cd_cp': {
      badge: 'Resultado misto (1–1)',
      title: 'Combo Estratégia Segura',
      subtitle: 'Estratégia Cultural Segura',
      description: 'Você tem necessidades em dois eixos: inteligência de nichos e segurança e auditoria de imagem. As ferramentas indicadas são o Community Discovery (para descoberta e mapeamento) + Creator Pulse (para reputação e compliance).',
      solutions: [
        { name: 'Cultura e segurança simultaneamente' },
        { name: 'Curadoria de criadores alinhados com o seu público' },
        { name: 'Branding com compliance' },
        { name: 'Monitoramento dos nichos e creators' }
      ],
      cta: 'Agendar conversa com especialista',
      url: '#'
    },
    'ss_cp': {
      badge: 'Resultado misto (1–1)',
      title: 'Combo Performance Auditada',
      subtitle: 'Performance com Segurança',
      description: 'Você tem necessidades em dois eixos: gestão de campanhas com ROI e segurança e auditoria de imagem. As ferramentas indicadas são o Sprout Social (para operação e performance) + Creator Pulse (para reputação e compliance).',
      solutions: [
        { name: 'ROI + compliance em uma estratégia' },
        { name: 'Gestão de campanhas e reputação' },
        { name: 'Performance auditada em tempo real' },
        { name: 'Monitoramento de campanhas e creators' }
      ],
      cta: 'Agendar conversa com especialista',
      url: '#'
    }
  }
};
