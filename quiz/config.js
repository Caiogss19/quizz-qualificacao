export const quizJSON = {
  id: "sparkmaxx_diagnostico",
  title: "Diagnóstico Spark MAXX",
  nodes: {
    "start": {
      id: "start",
      type: "lead_form",
      title: "Antes de começar, nos conte um pouco sobre você",
      subtitle: "Preencha os dados abaixo para personalizar seu diagnóstico",
      fields: [
        { id: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo', required: true, errorMsg: 'Por favor, informe seu nome' },
        { id: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com', required: true, errorMsg: 'Informe um e-mail válido' },
        { id: 'celular', label: 'Celular / WhatsApp', type: 'tel', placeholder: '(00) 00000-0000', required: true, errorMsg: 'Informe seu celular' },
        { id: 'empresa', label: 'Empresa', type: 'text', placeholder: 'Nome da sua empresa', required: true, errorMsg: 'Informe sua empresa' }
      ],
      buttonText: "Começar diagnóstico",
      next: "perfil"
    },
    "perfil": {
      id: "perfil",
      type: "question",
      tag: "Passo 1",
      title: "Qual perfil descreve melhor você, atualmente?",
      subtitle: "Selecione a opção que mais se encaixa com seu momento atual",
      options: [
        { id: "A", icon: "🏢", text: "Empresa / Marca", next: "q2_empresa", value: "Empresa / Marca" },
        { id: "B", icon: "📣", text: "Agência de Publicidade/Marketing", next: "q2_agencia", value: "Agência de Publicidade/Marketing" },
        { id: "C", icon: "🎥", text: "Creator", next: "q2_creator", value: "Creator" },
        { id: "D", icon: "🎯", text: "Agência de Casting / Agenciador", next: "q2_casting", value: "Agência de Casting / Agenciador" }
      ]
    },
    "q2_empresa": {
      id: "q2_empresa",
      type: "question",
      tag: "Passo 2",
      title: "Qual é a sua maior prioridade ao trabalhar com influenciadores?",
      subtitle: "Selecione o que mais importa para sua estratégia hoje",
      options: [
        { icon: "🔍", text: "Encontrar criadores com fit real para minha marca", next: "q3_empresa", hint: "discovery" },
        { icon: "📊", text: "Medir resultados e comprovar ROI das campanhas", next: "q3_empresa", hint: "roi" },
        { icon: "🛡️", text: "Monitorar reputação e sentimento sobre minha marca", next: "q3_empresa", hint: "monitoring" },
        { icon: "⚙️", text: "Automatizar e escalar minha operação de influência", next: "q3_empresa", hint: "roi" },
        { icon: "🎯", text: "Entender nichos e comunidades antes de investir", next: "q3_empresa", hint: "discovery" }
      ]
    },
    "q3_empresa": {
      id: "q3_empresa",
      type: "question",
      tag: "Passo 3",
      title: "Como você mede o sucesso das suas ações com influenciadores?",
      subtitle: "Selecione a métrica mais importante para o seu negócio",
      options: [
        { icon: "🎯", text: "Alcance de novos nichos e comunidades relevantes", next: "analyzing", hint: "discovery" },
        { icon: "📊", text: "ROI, conversões e impacto direto em vendas", next: "analyzing", hint: "roi" },
        { icon: "💬", text: "Sentimento positivo e reputação da marca", next: "analyzing", hint: "monitoring" },
        { icon: "⚡", text: "Eficiência operacional e redução de custo por ação", next: "analyzing", hint: "roi" },
        { icon: "🌱", text: "Crescimento orgânico de comunidades", next: "analyzing", hint: "discovery" }
      ]
    },
    "q2_agencia": {
      id: "q2_agencia",
      type: "question",
      tag: "Passo 2",
      title: "Qual é o maior gargalo na sua operação de influência hoje?",
      subtitle: "Selecione o principal ponto de dor da sua agência",
      options: [
        { icon: "🗂️", text: "Descobrir e curar creators certos para cada cliente", next: "q3_agencia", hint: "discovery" },
        { icon: "📋", text: "Relatórios e comprovação de resultados para o cliente", next: "q3_agencia", hint: "roi" },
        { icon: "👁️", text: "Monitorar menções e sentimento das marcas dos clientes", next: "q3_agencia", hint: "monitoring" },
        { icon: "🚀", text: "Escalar operações gerenciando múltiplos clientes", next: "q3_agencia", hint: "roi" },
        { icon: "🔎", text: "Curadoria cultural e fit entre creator e marca", next: "q3_agencia", hint: "discovery" }
      ]
    },
    "q3_agencia": {
      id: "q3_agencia",
      type: "question",
      tag: "Passo 3",
      title: "O que seus clientes mais cobram da sua agência em campanhas de influência?",
      subtitle: "Selecione o principal critério de sucesso para seus clientes",
      options: [
        { icon: "🔍", text: "Qualidade e fit cultural dos creators selecionados", next: "analyzing", hint: "discovery" },
        { icon: "📈", text: "Resultados mensuráveis e comprovação de ROI", next: "analyzing", hint: "roi" },
        { icon: "🛡️", text: "Proteção de reputação e monitoramento de marca", next: "analyzing", hint: "monitoring" },
        { icon: "🚀", text: "Agilidade na entrega e escala das campanhas", next: "analyzing", hint: "roi" },
        { icon: "🎯", text: "Precisão na segmentação por nicho e audiência", next: "analyzing", hint: "discovery" }
      ]
    },
    "q2_creator": {
      id: "q2_creator",
      type: "question",
      tag: "Passo 2",
      title: "O que você mais quer conquistar como creator agora?",
      subtitle: "Seja honesto — isso vai nos ajudar a indicar o melhor caminho",
      options: [
        { icon: "🎨", text: "Entender melhor minha audiência e nicho cultural", next: "q3_creator", hint: "cultural" },
        { icon: "💰", text: "Provar meu valor e fechar contratos maiores com marcas", next: "q3_creator", hint: "professional" },
        { icon: "📈", text: "Crescer minha audiência de forma estratégica", next: "q3_creator", hint: "cultural" },
        { icon: "📊", text: "Ter relatórios profissionais de performance", next: "q3_creator", hint: "professional" },
        { icon: "💼", text: "Profissionalizar minha cobrança e negociações", next: "q3_creator", hint: "professional" }
      ]
    },
    "q3_creator": {
      id: "q3_creator",
      type: "question",
      tag: "Passo 3",
      title: "Como você se apresenta para marcas hoje?",
      subtitle: "Descreva como conquista parcerias atualmente",
      options: [
        { icon: "🌍", text: "Mostro minha conexão cultural com minha audiência", next: "analyzing", hint: "cultural" },
        { icon: "📊", text: "Apresento dados e métricas de performance", next: "analyzing", hint: "professional" },
        { icon: "📄", text: "Tenho mídia kit mas quero torná-lo mais profissional", next: "analyzing", hint: "professional" },
        { icon: "💬", text: "Ainda faço tudo informalmente por DM/WhatsApp", next: "analyzing", hint: "professional" },
        { icon: "🎨", text: "Pelo meu estilo de conteúdo e identidade de nicho", next: "analyzing", hint: "cultural" }
      ]
    },
    "q2_casting": {
      id: "q2_casting",
      type: "question",
      tag: "Passo 2",
      title: "Qual é o maior obstáculo na sua operação de casting hoje?",
      subtitle: "Selecione o principal desafio do seu trabalho diário",
      options: [
        { icon: "🗺️", text: "Mapear e descobrir novos talentos com fit para marcas", next: "q3_casting", hint: "discovery" },
        { icon: "📲", text: "Apresentar resultados e ROI dos talentos para marcas", next: "q3_casting", hint: "roi" },
        { icon: "👁️", text: "Monitorar reputação e sentimento dos talentos online", next: "q3_casting", hint: "monitoring" },
        { icon: "⚙️", text: "Gerenciar múltiplos talentos e contratos com eficiência", next: "q3_casting", hint: "roi" },
        { icon: "🎯", text: "Identificar fit cultural entre talentos e marcas", next: "q3_casting", hint: "discovery" }
      ]
    },
    "q3_casting": {
      id: "q3_casting",
      type: "question",
      tag: "Passo 3",
      title: "O que as marcas mais valorizam quando você apresenta talentos?",
      subtitle: "Selecione o critério mais decisivo nas negociações",
      options: [
        { icon: "🎯", text: "Fit cultural e autenticidade do talent com a marca", next: "analyzing", hint: "discovery" },
        { icon: "📊", text: "Dados de performance e ROI histórico dos talentos", next: "analyzing", hint: "roi" },
        { icon: "🛡️", text: "Reputação online e histórico sem crises", next: "analyzing", hint: "monitoring" },
        { icon: "⚡", text: "Agilidade e profissionalismo na condução do processo", next: "analyzing", hint: "roi" },
        { icon: "🌐", text: "Alcance em nichos específicos e comunidades", next: "analyzing", hint: "discovery" }
      ]
    },
    "analyzing": {
      id: "analyzing",
      type: "loading",
      title: "Analisando seu perfil...",
      subtitle: "Processando suas respostas para encontrar a solução ideal",
      duration: 2400,
      next: "result"
    },
    "result": {
      id: "result",
      type: "result"
    }
  },
  results: {
    'community_discovery': {
      id: 'community_discovery',
      title: 'Community Discovery',
      badge: '🔍 Solução recomendada',
      description: 'Você precisa de inteligência para mapear nichos, encontrar os criadores certos e entender profundamente as comunidades antes de investir.',
      solutions: [
        { icon: '🗺️', name: 'Mapeamento de Nichos', desc: 'Descubra comunidades e micro-influenciadores com fit cultural real.' },
        { icon: '🎯', name: 'Inteligência Cultural', desc: 'Entenda o que cada nicho consome, valoriza e rejeita.' },
        { icon: '🔬', name: 'Análise de Perfil', desc: 'Dados profundos sobre audiência, engajamento e autenticidade.' },
      ],
      cta: 'Quero conhecer o Community Discovery',
      url: 'https://inlead.digital'
    },
    'sprout_social': {
      id: 'sprout_social',
      title: 'Sprout Social Influencer Marketing',
      badge: '📊 Solução recomendada',
      description: 'Sua operação precisa de gestão ponta a ponta: do briefing à entrega, com comprovação real de ROI.',
      solutions: [
        { icon: '⚙️', name: 'Gestão Ponta a Ponta', desc: 'Gerencie toda a jornada: briefing, aprovação, entrega e pagamento.' },
        { icon: '📈', name: 'Comprovação de ROI', desc: 'Relatórios automáticos com CPE, CPM, alcance real e impacto.' },
        { icon: '🔄', name: 'Fluxos Automatizados', desc: 'Reduza trabalho manual e escale operações rapidamente.' },
      ],
      cta: 'Quero conhecer o Sprout Social',
      url: 'https://inlead.digital'
    },
    'monitoring_insights': {
      id: 'monitoring_insights',
      title: 'Monitoring & Insights',
      badge: '👁️ Solução recomendada',
      description: 'Você precisa de visibilidade total: monitorar o que falam da sua marca, entender o sentimento e proteger sua reputação.',
      solutions: [
        { icon: '📡', name: 'Monitoramento', desc: 'Acompanhe menções, sentimento e tendências 24/7.' },
        { icon: '🛡️', name: 'Gestão de Reputação', desc: 'Identifique crises antes que escalem e reaja com dados.' },
        { icon: '💡', name: 'Insights de Mercado', desc: 'Entenda o que o mercado fala sobre você e concorrentes.' },
      ],
      cta: 'Quero conhecer o Monitoring & Insights',
      url: 'https://inlead.digital'
    },
    'cultural_influencer': {
      id: 'cultural_influencer',
      title: 'Seu Perfil: Cultural Influencer',
      badge: '🎨 Seu resultado',
      description: 'Você é um criador com forte conexão cultural. Sua audiência precisa ser compreendida para valorizar seu trabalho.',
      solutions: [
        { icon: '🌍', name: 'Dados de Audiência', desc: 'Relatórios demográficos e comportamentais da sua audiência.' },
        { icon: '🎯', name: 'Fit Cultural', desc: 'Descubra quais marcas têm fit real com seu nicho.' },
        { icon: '💎', name: 'Valorização do Conteúdo', desc: 'Use dados para mostrar o valor real do seu conteúdo.' },
      ],
      cta: 'Quero valorizar meu perfil',
      url: 'https://inlead.digital'
    },
    'professional_creator': {
      id: 'professional_creator',
      title: 'Seu Perfil: Professional Creator',
      badge: '🚀 Seu resultado',
      description: 'Com relatórios automáticos e ferramentas de gestão, você eleva suas negociações e fecha contratos maiores.',
      solutions: [
        { icon: '📊', name: 'Relatórios de Performance', desc: 'Apresente métricas profissionais de cada campanha.' },
        { icon: '💼', name: 'Profissionalização', desc: 'Mídia kit digital, precificação estruturada e contratos.' },
        { icon: '🤝', name: 'Conexão com Marcas', desc: 'Apareça para as marcas certas com um perfil verificado.' },
      ],
      cta: 'Quero me profissionalizar',
      url: 'https://inlead.digital'
    }
  }
};
