const scenarios = [
  {
    id:'oficinas',label:'Oficinas',symbol:'OF',kicker:'OFICINAS · ATENDIMENTO E SERVIÇO',
    title:'Do agendamento ao carro entregue.',
    description:'Um pedido chega com os dados do veículo, encontra o responsável certo e segue com histórico visível para a equipe e o cliente.',
    case:{id:'OF-204',name:'Marina Alves',summary:'Revisão de freios · solicitação pelo site',fields:[['Veículo','Honda Civic 2020'],['Preferência','Terça-feira'],['Serviço','Freios e revisão']]},
    stages:[
      {label:'Pedido recebido',status:'Aguardando triagem',owner:'Atendimento',title:'A solicitação chega completa',description:'O pedido preserva veículo, serviço e dia preferido. A equipe vê o que precisa confirmar.',context:'Honda Civic 2020 · freios · terça-feira',next:'Verificar disponibilidade da oficina',message:'Olá! Gostaria de agendar uma revisão de freios para meu Honda Civic 2020, de preferência na terça-feira.'},
      {label:'Triagem',status:'Em análise',owner:'Recepção',title:'A equipe assume o pedido',description:'Um responsável é definido e o serviço fica identificado sem pedir ao cliente as mesmas informações.',context:'Pedido do formulário associado à ficha do veículo',next:'Oferecer horário disponível',message:'Marina, recebemos seu pedido de revisão de freios. Estamos verificando os horários disponíveis para terça-feira.'},
      {label:'Confirmação',status:'Horário confirmado',owner:'Recepção',title:'Agendamento confirmado',description:'O horário só aparece como confirmado após validação da agenda pela oficina.',context:'Terça-feira · 10h · revisão de freios',next:'Receber veículo e validar orçamento',message:'Marina, sua revisão ficou agendada para terça-feira às 10h. Vamos confirmar o orçamento antes de qualquer reparo.'},
      {label:'Acompanhamento',status:'Em atendimento',owner:'Oficina',title:'Histórico do serviço atualizado',description:'A equipe registra andamento e próximo contato. A aprovação do orçamento continua com a pessoa responsável.',context:'Veículo recebido · orçamento em elaboração',next:'Apresentar orçamento para aprovação',message:'Marina, seu veículo já está na oficina. A equipe está avaliando os freios e enviará o orçamento para sua aprovação.'}
    ],
    improvement:'Ficha única do veículo que liga agendamento, atendimento e evolução do serviço. Na Sátiro, a demonstração pode começar pelo formulário de agendamento já publicado.',
    pilot:'Uma unidade e um serviço, conectando a entrada atual a um quadro de pedidos e confirmações.',
    question:'Hoje, em qual etapa um pedido como esse exige mais trabalho manual?'
  },
  {
    id:'imobiliarias',label:'Imobiliárias',symbol:'IM',kicker:'IMOBILIÁRIAS · INTERESSE E VISITA',
    title:'Cada contato chega com contexto.',
    description:'O corretor recebe imóvel, modalidade e preferências. O atendimento pode seguir para visita ou nova opção sem recomeçar a conversa.',
    case:{id:'IM-117',name:'Rafael Lima',summary:'Interessado em locação · Águas Claras',fields:[['Tipo','Apartamento para alugar'],['Região','Águas Claras'],['Perfil','2 quartos · até R$ 3.500']]},
    stages:[
      {label:'Interesse',status:'Novo interessado',owner:'Captação',title:'Perfil de busca registrado',description:'A preferência e o imóvel consultado entram juntos no pedido.',context:'Locação · Águas Claras · 2 quartos',next:'Encaminhar à equipe de locação',message:'Olá! Procuro apartamento de 2 quartos em Águas Claras, até R$ 3.500 por mês.'},
      {label:'Distribuição',status:'Com corretor',owner:'Locação',title:'Corretor recebe o contexto',description:'A separação entre venda e locação é respeitada. O corretor já vê faixa de preço e região.',context:'Canal de locação · faixa de preço preservada',next:'Validar disponibilidade do imóvel',message:'Rafael, recebemos seu perfil de busca. Vou verificar as opções disponíveis em Águas Claras.'},
      {label:'Visita',status:'Visita proposta',owner:'Corretor',title:'Próximo passo visível',description:'O corretor propõe uma visita e registra quando deve retomar o interessado.',context:'Imóvel de referência · visita em avaliação',next:'Confirmar data da visita',message:'Encontrei uma opção de 2 quartos dentro da faixa que você informou. Gostaria de conhecer o imóvel?'},
      {label:'Nova opção',status:'Acompanhamento',owner:'Corretor',title:'Preferências continuam úteis',description:'Se a primeira opção não servir, a equipe pode oferecer outra com critérios claros.',context:'Região e orçamento continuam no histórico',next:'Enviar alternativa revisada pelo corretor',message:'Rafael, se esta opção não atender, posso separar outra na mesma região e dentro do seu orçamento.'}
    ],
    improvement:'Histórico por pessoa e imóvel, mantendo separados os canais de venda e locação. A JPIB já apresenta essa divisão nos contatos públicos.',
    pilot:'Um canal de entrada e uma carteira de imóveis, conectados ao sistema comercial utilizado pela equipe.',
    question:'Quando a primeira opção não serve, as preferências ficam acessíveis para um novo contato?'
  },
  {
    id:'educacao',label:'Educação',symbol:'ED',kicker:'EDUCAÇÃO · AULA E MATRÍCULA',
    title:'Da aula experimental à matrícula.',
    description:'Um pedido de aula ganha horário, presença e retorno comercial em uma jornada simples para a secretaria acompanhar.',
    case:{id:'ED-308',name:'Bruna Costa',summary:'Aula experimental · inglês online',fields:[['Curso','Inglês'],['Modalidade','Online'],['Preferência','Período noturno']]},
    stages:[
      {label:'Solicitação',status:'Aguardando vaga',owner:'Secretaria',title:'Interesse identificado',description:'Curso, modalidade e horário desejado acompanham o pedido desde o primeiro contato.',context:'Inglês online · período noturno',next:'Confirmar turma ou aula disponível',message:'Olá! Gostaria de experimentar uma aula de inglês online à noite.'},
      {label:'Agendamento',status:'Aula confirmada',owner:'Secretaria',title:'Horário validado',description:'A secretaria confirma um horário real antes de apresentar a aula como marcada.',context:'Quinta-feira · 19h · aula experimental',next:'Enviar orientações de acesso à aula',message:'Bruna, temos uma aula experimental na quinta-feira às 19h. Posso confirmar sua participação?'},
      {label:'Participação',status:'Aula realizada',owner:'Equipe pedagógica',title:'Presença registrada',description:'A equipe vê quem participou e quem ainda precisa reagendar.',context:'Presença confirmada · interesse mantido',next:'Retomar conversa sobre matrícula',message:'Foi ótimo receber você na aula, Bruna. Posso tirar dúvidas sobre o curso e os próximos horários?'},
      {label:'Matrícula',status:'Em decisão',owner:'Matrículas',title:'Retorno organizado',description:'Uma tarefa de acompanhamento mostra à equipe quando conversar novamente.',context:'Aula realizada · proposta de horários enviada',next:'Confirmar escolha da turma',message:'Separei as opções de turma noturna para você comparar. Qual horário funciona melhor?'}
    ],
    improvement:'Acompanhamento da aula experimental até a decisão, incluindo faltas e pedidos sem horário. A página da Dialogue já oferece o primeiro contato para aula.',
    pilot:'Uma modalidade ou um curso, com agenda existente e registro de presença e matrícula.',
    question:'Vocês sabem quantas aulas experimentais viram matrículas e em qual etapa ocorre a maior perda?'
  },
  {
    id:'odontologia',label:'Odontologia',symbol:'OD',kicker:'ODONTOLOGIA · AGENDA ADMINISTRATIVA',
    title:'Agendamento com clareza para a recepção.',
    description:'A demonstração trata apenas de horário, confirmação e pendências administrativas. A clínica mantém todas as decisões clínicas.',
    case:{id:'OD-086',name:'Ana Ribeiro',summary:'Pedido de avaliação · sem informação clínica',fields:[['Contato','WhatsApp'],['Preferência','Quarta à tarde'],['Tipo','Avaliação']]},
    stages:[
      {label:'Pedido',status:'Sem horário',owner:'Recepção',title:'Pedido chega à fila',description:'A recepção identifica quem pediu avaliação e qual período prefere.',context:'Avaliação · quarta-feira à tarde',next:'Verificar agenda disponível',message:'Olá! Gostaria de marcar uma avaliação na quarta-feira à tarde.'},
      {label:'Agenda',status:'Horário oferecido',owner:'Recepção',title:'Vaga conferida',description:'O horário oferecido foi conferido na agenda antes de responder.',context:'Quarta-feira · 15h · disponibilidade verificada',next:'Aguardar confirmação da pessoa',message:'Ana, temos horário na quarta-feira às 15h para avaliação. Esse horário funciona para você?'},
      {label:'Confirmação',status:'Consulta confirmada',owner:'Recepção',title:'Agendamento concluído',description:'O pedido sai da fila de pendências e passa para os confirmados.',context:'Quarta-feira · 15h · confirmação registrada',next:'Preparar lembrete administrativo',message:'Perfeito, Ana. Sua avaliação está confirmada para quarta-feira às 15h.'},
      {label:'Lembrete',status:'Aguardando atendimento',owner:'Recepção',title:'Comparecimento acompanhado',description:'A equipe pode revisar um lembrete de horário e registrar presença.',context:'Sem dados clínicos no fluxo demonstrado',next:'Receber a pessoa no horário marcado',message:'Olá, Ana! Passando para lembrar sua avaliação amanhã às 15h. Se precisar reagendar, avise a recepção.'}
    ],
    improvement:'Fila administrativa com responsável e situação de cada pedido. Para a Odontolago, o fluxo parte dos convites de avaliação já visíveis na página.',
    pilot:'Uma agenda e uma equipe de recepção, com somente os dados necessários para marcar e confirmar.',
    question:'O que mais consome tempo da recepção: localizar vaga, confirmar ou retomar pedidos?'
  },
  {
    id:'contabilidade',label:'Contabilidade',symbol:'CO',kicker:'CONTABILIDADE · INTERESSE E PROPOSTA',
    title:'Uma proposta começa bem antes do PDF.',
    description:'O contato informa seu tipo de negócio, chega ao responsável e segue por reunião e proposta com as informações necessárias.',
    case:{id:'CO-142',name:'Camila Martins',summary:'Pet shop · troca de escritório contábil',fields:[['Negócio','Pet shop'],['Demanda','Troca de contador'],['Origem','Formulário do site']]},
    stages:[
      {label:'Contato',status:'Novo pedido',owner:'Comercial',title:'Perfil capturado',description:'Tipo de negócio e demanda vêm do primeiro contato para a equipe.',context:'Negócio pet · troca de contador',next:'Validar dados para a reunião',message:'Tenho um pet shop e gostaria de entender como funciona a troca de contador.'},
      {label:'Classificação',status:'Qualificado',owner:'Atendimento',title:'Checklist comercial aberto',description:'A equipe vê o que ainda precisa perguntar para uma conversa útil.',context:'Origem do formulário · serviço identificado',next:'Agendar conversa com especialista',message:'Camila, entendi que você busca trocar de escritório contábil para seu pet shop. Podemos marcar uma conversa breve?'},
      {label:'Reunião',status:'Reunião marcada',owner:'Sócio responsável',title:'Contexto pronto para a reunião',description:'A pessoa responsável recebe o resumo e as perguntas ainda abertas.',context:'Pet shop · troca de contador · reunião agendada',next:'Levantar escopo e preparar proposta',message:'Sua conversa com nossa equipe ficou marcada para sexta-feira. Vamos entender sua operação antes de preparar uma proposta.'},
      {label:'Proposta',status:'Proposta em análise',owner:'Comercial',title:'Retorno com responsável',description:'A proposta passa por revisão do escritório. O acompanhamento registra prazo e próximo contato.',context:'Escopo validado em reunião · proposta revisada',next:'Retomar dúvidas da cliente',message:'Camila, encaminhamos a proposta revisada pela equipe. Fico à disposição para conversar sobre os próximos passos.'}
    ],
    improvement:'O perfil do negócio pet acompanha a solicitação até a reunião e a proposta. A Objetiva já usa esse foco em seu formulário público.',
    pilot:'Um tipo de solicitação comercial, preservando o formulário e o WhatsApp utilizados pelo escritório.',
    question:'O que sua equipe precisa descobrir em cada conversa antes de marcar uma reunião?'
  },
  {
    id:'energia-solar',label:'Energia solar',symbol:'SO',kicker:'ENERGIA SOLAR · SIMULAÇÃO E PROPOSTA',
    title:'A simulação continua no comercial.',
    description:'O contexto da simulação acompanha o pedido até a análise técnica, a visita e a proposta. Valores são ilustrativos.',
    case:{id:'SO-521',name:'Condomínio Horizonte',summary:'Simulação ilustrativa · proposta a avaliar',fields:[['Conta informada','R$ 2.400/mês'],['Tipo','Condomínio'],['Origem','Simulador do site']]},
    stages:[
      {label:'Simulação',status:'Pedido recebido',owner:'Comercial',title:'Resultado vinculado ao pedido',description:'O valor informado no simulador acompanha a solicitação. Nenhuma economia é prometida.',context:'Condomínio · conta informada de R$ 2.400/mês',next:'Qualificar imóvel e necessidades',message:'Fiz uma simulação no site para nosso condomínio. Podemos conversar sobre um projeto? '},
      {label:'Qualificação',status:'Dados em análise',owner:'Consultor',title:'Contexto preservado',description:'O consultor não precisa redescobrir a origem e os dados iniciais do pedido.',context:'Origem do simulador · demanda condominial',next:'Agendar avaliação técnica',message:'Recebemos a solicitação e o valor informado na simulação. Nossa equipe vai avaliar o imóvel antes de apresentar números finais.'},
      {label:'Visita',status:'Visita agendada',owner:'Equipe técnica',title:'Análise técnica separada',description:'A equipe responsável verifica condições reais antes de qualquer dimensionamento ou orçamento.',context:'Visita técnica · escopo ainda em avaliação',next:'Concluir dimensionamento e proposta',message:'A visita técnica está marcada. Depois da avaliação, apresentaremos uma proposta adequada ao condomínio.'},
      {label:'Proposta',status:'Proposta enviada',owner:'Comercial',title:'Retorno acompanhado',description:'A equipe acompanha quem recebeu a proposta, pendências e data do próximo contato.',context:'Simulação inicial e proposta técnica no mesmo histórico',next:'Revisar dúvidas com o síndico',message:'A proposta técnica está pronta. Podemos marcar uma conversa para apresentar os detalhes e esclarecer as dúvidas?'}
    ],
    improvement:'Na LGS, o simulador e o aplicativo já existem. A demonstração mostra o resultado da simulação chegando ao acompanhamento comercial sem refazer esses produtos.',
    pilot:'Uma origem de pedido do simulador conectada ao CRM e às etapas da proposta técnica.',
    question:'Quando chega uma simulação, quais dados precisam ser perguntados novamente?'
  },
  {
    id:'pilates',label:'Pilates',symbol:'PI',kicker:'PILATES · AULA E PLANO',
    title:'A experiência continua depois da primeira aula.',
    description:'A agenda existente informa a presença e dá à equipe um próximo passo para conversar sobre horários e planos disponíveis.',
    case:{id:'PI-078',name:'Luiza Monteiro',summary:'Aula experimental · unidade Lago Norte',fields:[['Unidade','Lago Norte'],['Tipo','Aula experimental'],['Preferência','Manhã']]},
    stages:[
      {label:'Agendamento',status:'Aula solicitada',owner:'Recepção',title:'Pedido vindo da agenda',description:'A aula entra no acompanhamento da unidade com preferência de horário.',context:'Unidade Lago Norte · aula experimental',next:'Validar vaga disponível',message:'Olá! Gostaria de fazer uma aula experimental no Lago Norte, de preferência pela manhã.'},
      {label:'Confirmação',status:'Aula confirmada',owner:'Recepção',title:'Vaga confirmada pela equipe',description:'A agenda mostra o horário disponível e o pedido recebe confirmação.',context:'Lago Norte · terça-feira · 9h',next:'Receber participante na aula',message:'Luiza, sua aula experimental está confirmada para terça-feira às 9h na unidade Lago Norte.'},
      {label:'Presença',status:'Aula realizada',owner:'Instrutor',title:'Participação registrada',description:'O atendimento comercial sabe que a pessoa participou antes de retomar a conversa.',context:'Presença registrada na unidade Lago Norte',next:'Conversar sobre rotina e horários',message:'Luiza, esperamos que tenha gostado da aula. Posso apresentar as opções de horários disponíveis para sua rotina?'},
      {label:'Plano',status:'Em escolha de plano',owner:'Atendimento',title:'Próximo passo por unidade',description:'A equipe acompanha a escolha do plano e pode analisar conversões por unidade.',context:'Horários disponíveis confirmados pela unidade',next:'Confirmar frequência e plano escolhido',message:'Separei as opções de frequência e horários disponíveis no Lago Norte. Qual combinação atende melhor você?'}
    ],
    improvement:'A WOL já oferece agendamento online. Aqui, a agenda alimenta o acompanhamento da aula experimental até a contratação de plano, separado por unidade.',
    pilot:'Uma unidade e uma integração da agenda existente com registro de presença e plano contratado.',
    question:'Hoje vocês conseguem comparar quantas aulas experimentais viram planos em cada unidade?'
  }
];

const originalResearch = {
  oficinas:['Tecnologia e logística','Sátiro Centro Automotivo','https://www.satirocentroautomotivo.com.br/','O site oferece agendamento de serviços.'],
  imobiliarias:['Imóveis e infraestrutura','JPIB Imóveis','https://www.jpibimoveis.com.br/contato','O site separa os canais de venda e locação.'],
  educacao:['Educação e espaços','Dialogue English School','https://dialogueenglishschool.com.br/','O site oferece contato para aula experimental.'],
  odontologia:['Saúde e bem-estar','Odontolago','https://odontolago.com.br/','A página convida a agendar avaliação pelo WhatsApp.'],
  contabilidade:['Serviços profissionais','Objetiva Contábil','https://objetivacontabil.com.br/contato/','O formulário é direcionado a negócios pet.'],
  'energia-solar':['Imóveis e infraestrutura','LGS Energia Solar e Automação','https://lgsengenharia.com.br/','O site já oferece simulador e aplicativo.'],
  pilates:['Saúde e bem-estar','WOL Pilates','https://www.wolpilates.com/','O site oferece agenda online de aula experimental.']
};
for (const item of scenarios) {
  const [grupo,empresa,fonte,sinal] = originalResearch[item.id];
  item.research = {grupo,empresa,fonte,sinal,oportunidade:item.question,cuidado:'Confirmar o problema, o volume de pedidos, o sistema atual e quem decide sobre a integração.',indicador:'Tempo até resposta; conversão entre as etapas do piloto; pedidos sem próxima ação.'};
}
for (const p of window.syncropipeNiches || []) {
  scenarios.push({
    id:p.id,label:p.nicho,icon:p.icone,kicker:`${p.nicho.toUpperCase()} · FLUXO CONECTADO`,title:p.titulo,
    description:p.inovacao,case:{id:`DEMO-${p.id.toUpperCase()}`,name:p.exemplo.split(' · ')[0],summary:p.exemplo,fields:p.campos},
    stages:p.etapas.map((s,index) => ({label:s[0],status:index===0?'Pedido recebido':`${s[0]} · exemplo`,owner:s[1],title:s[0],description:s[2],context:p.campos.map(([k,v])=>`${k}: ${v}`).join(' · '),next:p.etapas[index+1]?.[2] || 'Registrar resultado e combinar o próximo acompanhamento.',message:s[3]})),
    improvement:p.inovacao,pilot:p.piloto,question:p.pergunta,research:p
  });
}
const byId = new Map(scenarios.map(item => [item.id,item]));
const element = id => document.getElementById(id);
const nav = element('niche-nav');
const requestedNiche=new URLSearchParams(location.search).get('nicho') || location.hash.slice(1);
let currentId = byId.has(requestedNiche) ? requestedNiche : scenarios[0].id;
let currentStep = 0;
let playback = null;
let pending = false;
const draftCache = new Map();

const svgNS='http://www.w3.org/2000/svg';
const iconShapes={
  paw:[['circle',{cx:6,cy:7,r:2}],['circle',{cx:11,cy:4,r:2}],['circle',{cx:17,cy:5,r:2}],['circle',{cx:21,cy:10,r:2}],['path',{d:'M7 15c1-5 7-6 10-1 5 7-3 7-5 5-6 3-9-1-5-4Z'}]],
  dumbbell:[['path',{d:'M6 4v16M3 8v8m15-12v16m3-12v8M6 12h12'}]],
  sparkles:[['path',{d:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm8-1v4m-2-2h4'}]],
  school:[['path',{d:'M3 21V9h5V5l4-3 4 3v4h5v12H3Zm7 0v-5h4v5M5 12v2m14-2v2M12 6v4'}]],
  ruler:[['path',{d:'m3 17 14-14 4 4L7 21l-4-4Zm9-9 3 3m-7 1 3 3m5-11 2 2'}]],
  helmet:[['path',{d:'M3 15a9 9 0 0 1 18 0M9 5v7m6-7v7M2 15h20v5H2z'}]],
  party:[['path',{d:'m4 20 4-13 9 9-13 4Zm7-16 1-2m5 7 4-1m-5-4 2-2M8 11l5 5'}]],
  desk:[['path',{d:'M2 13h20M4 13v8m16-8v8M7 3h10v7H7zM12 10v3'}]],
  clean:[['path',{d:'M15 2 9 14m-3-2 9 4-3 6-10-4 4-6Zm12-7h4m-2-2v4M8 17l-2 3'}]],
  shield:[['path',{d:'m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5l8-3Zm-4 10 3 3 5-6'}]],
  laundry:[['rect',{x:4,y:2,width:16,height:20,rx:2}],['circle',{cx:12,cy:14,r:5}],['path',{d:'M7 6h1m3 0h6M8 14c3-3 5 3 8 0'}]],
  device:[['rect',{x:6,y:2,width:12,height:20,rx:2}],['path',{d:'M10 5h4m-3 14h2m-4-9-2 2 2 2m6-4 2 2-2 2'}]],
  bed:[['path',{d:'M3 4v17m18-11v11M3 17h18M3 9h7v8m0-7h8a3 3 0 0 1 3 3v4'}]],
  utensils:[['path',{d:'M4 2v6a3 3 0 0 0 6 0V2M7 2v20M20 2c-4 2-5 6-5 10h5m0-10v20'}]],
  truck:[['path',{d:'M2 5h12v12H2zM14 9h4l4 5v3h-8'}],['circle',{cx:6,cy:18,r:2}],['circle',{cx:18,cy:18,r:2}]],
  oficinas:[['path',{d:'M4 13l1.5-4.5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.5L20 13'}],['path',{d:'M3 13h18v5H3z'}],['path',{d:'M6 18v2m12-2v2M6.5 15.5h2m7 0h2'}]],
  imobiliarias:[['path',{d:'M4 21V5l8-3 8 3v16M3 21h18'}],['path',{d:'M8 7v2m4-2v2m4-2v2M8 12v2m4-2v2m4-2v2'}],['path',{d:'M10 21v-4h4v4'}]],
  educacao:[['path',{d:'M2 9l10-5 10 5-10 5L2 9Z'}],['path',{d:'M6 11v5c2 2 10 2 12 0v-5M22 9v7'}],['circle',{cx:'22',cy:'18',r:'1'}]],
  odontologia:[['path',{d:'M12 5c-2.2-1.8-4.8-2.2-6.5-.9-2.1 1.6-2.2 4.4-1.4 7.1.5 1.8 1.5 3.2 1.9 5.4.4 2.3.9 4.4 2.2 4.4 1.4 0 1.8-2.4 2.2-4.5.2-1.1.8-2.2 1.5-2.2s1.3 1.1 1.5 2.2c.4 2.1.8 4.5 2.2 4.5 1.3 0 1.8-2.1 2.2-4.4.4-2.2 1.4-3.6 1.9-5.4.8-2.7.7-5.5-1.4-7.1-1.7-1.3-4.3-.9-6.5.9'}]],
  contabilidade:[['rect',{x:'5',y:'2.5',width:'14',height:'19',rx:'2'}],['path',{d:'M8 6h8v3H8zM8 13h2m4 0h2M8 17h2m4 0h2'}]],
  'energia-solar':[['circle',{cx:'18',cy:'5',r:'2'}],['path',{d:'M18 1v1m0 6v1m-4-4h1m6 0h1m-6-3-1-1m6 7-1-1'}],['path',{d:'M3 11h17l2 8H1l2-8ZM8 11l-1 8m9-8 1 8M2 15h19M10 19v2m4-2v2'}]],
  pilates:[['circle',{cx:'12',cy:'4',r:'2'}],['path',{d:'M4 21h16M12 7v6m0 0-5 4m5-4 5 4M12 9 7 11m5-2 5 2'}]]
};

function makeIcon(id){
  const svg=document.createElementNS(svgNS,'svg');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
  svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');
  svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
  svg.setAttribute('aria-hidden','true');
  for(const [tag,attrs] of iconShapes[byId.get(id)?.icon || id]){
    const shape=document.createElementNS(svgNS,tag);
    for(const [key,value] of Object.entries(attrs))shape.setAttribute(key,value);
    svg.append(shape);
  }
  return svg;
}

function stopPlayback(){
  if(playback){clearInterval(playback);playback=null}
  element('play-button').innerHTML='Reproduzir demonstração <span aria-hidden="true">↗</span>';
}

function buildNavigation(){
  for(const group of [...new Set(scenarios.map(p=>p.research.grupo))].sort()){
    const option=document.createElement('option');option.value=group;option.textContent=group;element('niche-group').append(option);
  }
  for(const item of scenarios){
    const button=document.createElement('button');
    button.type='button';button.className='niche-button';button.dataset.niche=item.id;
    const symbol=document.createElement('span');symbol.className='niche-symbol';symbol.setAttribute('aria-hidden','true');symbol.append(makeIcon(item.id));
    const name=document.createElement('span');name.textContent=item.label;
    button.append(symbol,name);
    button.addEventListener('click',()=>{
      selectNiche(item.id);
      const url=new URL(location.href);url.searchParams.set('nicho',item.id);url.hash='';history.replaceState(null,'',url);
      if(matchMedia('(max-width:980px)').matches)element('scenario-title').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
    nav.append(button);
  }
  filterNavigation();
}

function filterNavigation(){
  const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const query=normalize(element('niche-search').value.trim());
  const group=element('niche-group').value;
  let visible=0;
  for(const button of nav.querySelectorAll('.niche-button')){
    const item=byId.get(button.dataset.niche);
    button.hidden=!(normalize(`${item.label} ${item.research.empresa} ${item.research.grupo}`).includes(query)&&(!group||item.research.grupo===group));
    if(!button.hidden)visible++;
  }
  element('niche-count').textContent=`${visible} de ${scenarios.length} ramos`;
  element('no-niches').hidden=visible>0;
}

function updateCommercialContext(item){
  const p=item.research;
  element('research-company').textContent=p.empresa;
  element('research-signal').textContent=p.sinal;
  element('research-opportunity').textContent=p.oportunidade;
  element('research-source').href=p.fonte;
  element('qualification-text').textContent=p.cuidado;
  element('metric-text').textContent=p.indicador;
  element('outreach-draft').value=draftCache.get(item.id) || `Olá! Sou Arthur, da SYNCROPIPE INTELLIGENCE. Vi a página da ${p.empresa} e como vocês recebem pedidos. ${item.question}\n\nPreparei um exemplo de ${item.label.toLowerCase()} que pode ajudar a explicar a ideia. Se fizer sentido para sua operação, podemos conversar sobre um piloto: ${item.pilot}`;
  element('copy-status').textContent='';
}

function updateFields(fields){
  const list=element('case-fields');list.replaceChildren();
  for(const [label,value] of fields){
    const row=document.createElement('div');const dt=document.createElement('dt');const dd=document.createElement('dd');
    dt.textContent=label;dd.textContent=value;row.append(dt,dd);list.append(row);
  }
}

function updateTimeline(item){
  const line=element('timeline');line.replaceChildren();
  item.stages.forEach((stage,index)=>{
    const button=document.createElement('button');button.type='button';button.className='timeline-step';
    if(index<currentStep)button.classList.add('is-complete');
    if(index===currentStep)button.setAttribute('aria-current','step');
    button.setAttribute('aria-label',`Etapa ${index+1}: ${stage.label}`);
    const number=document.createElement('span');number.className='step-number';number.textContent=String(index+1).padStart(2,'0');
    const name=document.createElement('span');name.textContent=stage.label;
    button.append(number,name);
    button.disabled=pending && index!==currentStep;
    button.addEventListener('click',()=>{stopPlayback();currentStep=index;render()});
    line.append(button);
  });
}

function render(){
  const item=byId.get(currentId);
  const stage=item.stages[currentStep];
  document.title=`${item.label} | Protótipos SYNCROPIPE`;
  for(const button of nav.querySelectorAll('.niche-button')){
    if(button.dataset.niche===currentId)button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  }
  element('breadcrumb-niche').textContent=item.label;
  const kicker=element('scenario-kicker');
  const kickerIcon=document.createElement('span');kickerIcon.className='kicker-icon';kickerIcon.append(makeIcon(item.id));
  const kickerText=document.createElement('span');kickerText.textContent=item.kicker;
  kicker.replaceChildren(kickerIcon,kickerText);
  element('scenario-title').textContent=item.title;
  element('scenario-description').textContent=item.description;
  element('case-id').textContent=item.case.id;
  element('case-name').textContent=item.case.name;
  element('case-summary').textContent=item.case.summary;
  updateFields(item.case.fields);
  element('step-count').textContent=`${String(currentStep+1).padStart(2,'0')} / ${String(item.stages.length).padStart(2,'0')}`;
  updateTimeline(item);
  element('status-text').textContent=pending?'Aguardando informação':stage.status;
  element('owner-tag').textContent=stage.owner;
  element('action-title').textContent=pending?'Pendência antes de continuar':stage.title;
  element('action-description').textContent=pending?'A equipe mantém o pedido na etapa atual e solicita a informação necessária. A próxima etapa fica bloqueada até a validação.':stage.description;
  element('context-text').textContent=stage.context;
  element('next-action').textContent=pending?'Confirmar a informação pendente com a pessoa responsável antes de avançar.':stage.next;
  const messages=element('phone-message');messages.replaceChildren();
  for(const [index,entry] of item.stages.slice(0,currentStep+1).entries()){
    const bubble=document.createElement('div');bubble.className=`message ${index===0?'message-incoming':''}`;
    const who=document.createElement('span');who.className='message-author';who.textContent=index===0?'CLIENTE · EXEMPLO':'EQUIPE · EXEMPLO';
    const text=document.createElement('span');text.textContent=entry.message;bubble.append(who,text);messages.append(bubble);
  }
  if(pending){const bubble=document.createElement('div');bubble.className='message message-pending';bubble.textContent='Precisamos confirmar uma informação para seguir. Um responsável vai revisar a pendência e retornar.';messages.append(bubble)}
  const conversation=messages.closest('.phone-conversation');conversation.scrollTop=conversation.scrollHeight;
  element('flow-feedback').textContent=pending?'Fluxo pausado: a pendência continua visível para a equipe.':currentStep===item.stages.length-1?'Demonstração concluída. Use a pergunta abaixo para validar o interesse.':'A equipe valida cada etapa antes de avançar.';
  document.querySelector('.demo-area').classList.toggle('has-pending',pending);
  element('improvement-text').textContent=item.improvement;
  element('pilot-text').textContent=item.pilot;
  element('question-text').textContent=item.question;
  element('prev-button').disabled=currentStep===0 || pending;
  element('next-button').disabled=pending;
  element('next-button').textContent=currentStep===item.stages.length-1?'Preparar abordagem ↓':'Próxima etapa →';
  element('play-button').disabled=pending;
}

function selectNiche(id){
  if(!byId.has(id))return;
  stopPlayback();currentId=id;currentStep=0;pending=false;element('flow-state').value='normal';updateCommercialContext(byId.get(id));render();
}

element('prev-button').addEventListener('click',()=>{stopPlayback();currentStep=Math.max(0,currentStep-1);render()});
element('next-button').addEventListener('click',()=>{stopPlayback();if(currentStep===byId.get(currentId).stages.length-1){element('abordagem').scrollIntoView({behavior:'smooth',block:'start'});return}currentStep++;render()});
element('reset-button').addEventListener('click',()=>{stopPlayback();currentStep=0;pending=false;element('flow-state').value='normal';render()});
element('play-button').addEventListener('click',()=>{
  if(playback){stopPlayback();return}
  if(currentStep===byId.get(currentId).stages.length-1){currentStep=0;render()}
  element('demonstracao').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  element('play-button').textContent='Pausar demonstração';
  playback=setInterval(()=>{
    if(currentStep<byId.get(currentId).stages.length-1){currentStep++;render()}
    else stopPlayback();
  },3000);
});
window.addEventListener('hashchange',()=>{
  const requested=location.hash.slice(1);
  selectNiche(requested);
});

buildNavigation();
updateCommercialContext(byId.get(currentId));
element('niche-search').addEventListener('input',filterNavigation);
element('niche-group').addEventListener('change',filterNavigation);
element('flow-state').addEventListener('change',()=>{stopPlayback();pending=element('flow-state').value==='pending';render()});
element('outreach-draft').addEventListener('input',()=>{draftCache.set(currentId,element('outreach-draft').value);element('copy-status').textContent='Rascunho ajustado nesta sessão.'});
element('copy-outreach').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(element('outreach-draft').value);element('copy-status').textContent='Abordagem copiada. Revise o destinatário antes de usar.'}
  catch{element('outreach-draft').focus();element('outreach-draft').select();element('copy-status').textContent='Texto selecionado. Use Ctrl+C para copiar.'}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback()});
render();
