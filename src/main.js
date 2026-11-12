import './style.css';
import './studio-shop.css';
import './navigation.css';
import { registerSW } from 'virtual:pwa-register';
import { initializeStudioShop } from './studio-shop.js';
import { CITY_MAP_ITEMS } from './city-map-items.js';

registerSW({ immediate: true });

(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var KEY = 'viseu-quest-v1';
  var LANG_KEY = 'viseu-quest-lang';
  var locale = 'en';
  try {
    var savedLocale = localStorage.getItem(LANG_KEY);
    if (savedLocale === 'en' || savedLocale === 'pt') locale = savedLocale;
  } catch (error) {
    console.warn('Viseu Quest language preference could not be loaded.', error);
  }
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#1d2a4a';
  var I18N = {
    en: {
      'tour.eyebrow': 'LEARN THE GAME',
      'tour.title': 'Quick tour',
      'tour.subtitle': 'See what each section is for and how the adventure works.',
      'tour.button': 'Quick tour',
      'account.eyebrow': 'KEEP PLAYING',
      'account.title': 'Studio account',
      'account.subtitle': 'Sign in to manage your Studio wallet and purchases. Game progress stays on this device.',
      'account.button': 'Sign up / Log in',
      'account.aria': 'Studio account access',
      'language.aria': 'Language selector',
      'tour.step.map': 'Map',
      'tour.step.profile': 'Profile',
      'tour.step.trails': 'Trails',
      'tour.step.passport': 'Passport',
      'tour.step.collection': 'Collection',
      'tour.step.avatar': 'Avatar',
      'tour.step.studio': 'Studio',
      'tour.step.map.detail': 'The map is your city guide. Tap a landmark, walk to it, and unlock that area’s stamp and quick quiz.',
      'tour.step.profile.detail': 'Your profile holds your explorer name, badge, and map privacy settings. Turn on location only when you want it shown on the city map.',
      'tour.step.trails.detail': 'Trails turn your adventure into challenges: stamps, quizzes, collectible finds, and longer streaks build your progress.',
      'tour.step.passport.detail': 'The passport keeps a running record of every landmark you collect so you can see which stops are done and still open.',
      'tour.step.collection.detail': 'Collections track rewards, collectibles, discovery coins, and souvenirs from the places you visit around Viseu.',
      'tour.step.avatar.detail': 'Spend coins in the avatar shop to change your explorer look and dress up your in-game identity.',
      'tour.step.studio.detail': 'The Studio shop is where you browse new art, founder perks, and special digital products built for the Viseu world.',
      'tour.back': 'Back',
      'tour.next': 'Next step',
      'tour.finish': 'Finish tour',
      'tour.goto': 'Go to {label} step',
      'nav.map': 'Map',
      'nav.profile': 'Profile',
      'nav.trails': 'Trails',
      'nav.passport': 'Passport',
      'nav.collection': 'Collection',
      'nav.avatar': 'Avatar',
      'nav.studio': 'Studio',
      'nav.main': 'Main navigation',
      'home.tagline': 'Walk the old town, check in at landmarks, collect stamps.',
      'map.hint': 'Tap the map to explore in full screen. Stylised map, not to scale.',
      'map.switch.game': 'Use game map',
      'map.switch.city': 'Use city map',
      'map.switch.street': 'Use street map',
      'map.unavailable': 'Street map unavailable',
      'map.loaderror': 'Street map could not load. Your illustrated game map is still available.',
      'map.fullscreen.hint': 'Tap a gold pin to collect a coin or explore its landmark in the game map.',
      'map.locate': 'Locate me',
      'map.close': 'Close map',
      'map.close.label': 'Close full-screen map',
      'map.aria': 'Stylised map of Viseu. Tap a place to walk there, or use the arrow keys.',
      'map.city.aria': 'Interactive street map centered on Viseu',
      'home.made': 'Made in Viseu, Portugal',
      'home.reset': 'Start over',
      'screen.adventure': 'YOUR ADVENTURE',
      'screen.passport': 'Viseu Passport',
      'screen.passport.close': 'Close passport',
      'screen.profile': 'Your Profile',
      'screen.profile.close': 'Close profile',
      'profile.explorer': 'Explorer name',
      'profile.name.placeholder': 'Curious Visitor',
      'profile.badge': 'Profile badge',
      'profile.badge.choose': 'Choose profile badge',
      'profile.badge.compass': 'Compass',
      'profile.badge.star': 'Star',
      'profile.badge.leaf': 'Leaf',
      'profile.badge.castle': 'Castle',
      'profile.mapprivacy': 'Map & privacy',
      'profile.device': 'Saved on this device',
      'profile.location': 'Allow location on city map',
      'profile.location.help': 'Off by default. Location is requested only when you tap “Locate me” and stays on this device.',
      'profile.approx': 'Approximate location',
      'profile.approx.help': 'Show a coarse area instead of your precise position.',
      'profile.audience': 'Who can see you?',
      'profile.audience.help': 'Preference for a future friends feature.',
      'profile.onlyme': 'Only me',
      'profile.friends': 'Friends',
      'profile.selected': 'Selected friends',
      'profile.health': 'Steps & reminders',
      'profile.health.help': 'Step syncing needs Apple Health or Health Connect and a native companion. GPS is used only on the city map after you opt in; it is not saved or sent to Viseu Quest.',
      'profile.health.button': 'View health-sync setup',
      'screen.trails.eyebrow': 'DISCOVER VISEU',
      'screen.trails': 'Viseu Trails',
      'screen.trails.close': 'Close trails',
      'screen.trails.intro': 'Complete trail challenges with the places, quizzes, and collectibles in this game. No steps or GPS are tracked.',
      'daily.title': 'Today’s adventure',
      'daily.streak': '{count}-day streak',
      'daily.best': ' · best {count}',
      'daily.headline.perfect': 'Perfect week!',
      'daily.headline.checked': 'You checked in today',
      'daily.headline.default': 'A little progress adds up',
      'daily.subline.perfect': 'Seven check-ins in a row · +50 coins and +30 XP',
      'daily.subline.checked': 'Nice work. Your streak is safe for today.',
      'daily.subline.default': 'Check in when you are ready. No streak loss or penalty.',
      'daily.claimed': 'Claimed today',
      'daily.claim': 'Claim check-in · +10 coins',
      'screen.collection': 'Collection',
      'screen.collection.close': 'Close collection',
      'collection.city': 'City map discoveries',
      'screen.avatar.eyebrow': 'CUSTOMIZE YOUR EXPLORER',
      'screen.avatar': 'Avatar Shop',
      'screen.avatar.close': 'Close avatar shop',
      'avatar.spend': 'Spend your Viseu coins',
      'studio.close': 'Close Studio Shop',
      'studio.eyebrow': 'MADE IN VISEU STUDIO',
      'studio.title': 'Little things, big adventures.',
      'studio.subtitle': 'A colorful collection from Viseu creators.',
      'studio.balance': 'YOUR BALANCE',
      'studio.coins': 'Viseu Coins',
      'studio.signin': 'Sign in',
      'studio.signout': 'Sign out',
      'studio.email.label': 'Sign in with an email link',
      'studio.email.send': 'Send link',
      'studio.category.all': 'All',
      'studio.category.founder': 'Founder Pass',
      'studio.category.art': 'Grão Vasco Art Packs',
      'studio.category.streak': 'Streak Boosts',
      'studio.footnote': 'Purchases are secured by Stripe. Digital items stay in your collection.',
      'modal.close': 'Close',
      'sound.on': 'Sound on',
      'sound.off': 'Sound off',
      'count.stamps': '{count} of 8 stamps',
      'reward.stamp': 'Stamp collected',
      'reward.coins': 'coins',
      'crate.title': 'A tile crate!',
      'crate.reveal': 'You reached {name}. Open the crate to reveal your stamp.',
      'crate.open': 'Open the crate',
      'quiz.feedback.correct': 'Correct! +20 coins and +20 XP',
      'quiz.feedback.incorrect': 'Not quite. The answer glows green.',
      'quiz.keep': 'Keep exploring',
      'stamp.all': 'All stamps!',
      'reward.chest': 'Treasure chest! +100 coins',
      'reward.legend': 'Viseu Legend +100 coins',
      'reward.level': 'Level {level}: {title}',
      'level.1': 'Curious Visitor',
      'level.2': 'Street Wanderer',
      'level.3': 'Local Guide',
      'level.4': 'Hilltop Hero',
      'level.5': 'Viseu Legend',
      'dock.welcome': 'Welcome back to {name}',
      'dock.at': 'You’re at {name}',
      'dock.stamp.quiz': 'Stamp collected and quiz done.',
      'dock.stamp.pending': 'Stamp collected. Quiz still open for bonus coins.',
      'dock.checkin': 'Check in to earn a stamp, XP and coins.',
      'dock.open': 'Open',
      'dock.checkin.button': 'Check in',
      'dock.legend': 'Viseu Legend!',
      'dock.allstamps': 'All 8 stamps collected. Keep wandering for leftover coins and grapes.',
      'dock.next': 'Next stop: {name}',
      'dock.steps': 'About {count} steps away. Pick up coins on the way.',
      'dock.walk': 'Walk there',
      'stamp.quiz.done': 'Stamped, quiz done',
      'stamp.done': 'Stamped',
      'stamp.notvisited': 'Not visited yet',
      'action.startover.confirm': 'Tap again to erase all progress',
      'daily.challenge.pickups': 'Find 3 map collectibles',
      'daily.challenge.stamp': 'Earn a landmark stamp',
      'daily.challenge.quiz': 'Finish a landmark quiz',
      'daily.challenge.checkin': 'Claim today’s check-in',
      'daily.challenge.collect-five': 'Find 5 collectibles today',
      'daily.challenge.claimed': 'Claimed',
      'daily.challenge.claim': 'Claim',
      'daily.challenge.progress': 'In progress',
      'trail.unlocked': 'Viseu Trail',
      'trail.locked': 'LOCKED CHAPTER',
      'trail.claimed': 'Sticker claimed',
      'trail.complete': 'Complete {required} of {total} to claim the chapter reward',
      'trail.previous': 'Claim the previous chapter reward to continue',
      'trail.sticker.collected': 'Sticker collected',
      'trail.sticker.claim': 'Claim chapter sticker · +50 coins',
      'trail.keep': 'Keep exploring',
      'collection.picked': '{found} of {total} picked up on the map',
      'collection.discovered': '{found} of {total} discovered',
      'collection.notfound': 'Not found yet',
      'avatar.wearing': 'Wearing',
      'avatar.owned': 'Owned',
      'avatar.buy': 'Buy',
      'avatar.wear': 'Wear',
      'avatar.need': 'Need {count} more coins for {name}',
      'avatar.nowwearing': 'Now wearing {name}',
      'action.quiz': 'Quick quiz: +20 coins',
      'action.later': 'Later',
      'action.close': 'Close',
      'action.quizkeep': 'Keep exploring',
      'quiz.title': 'Quick quiz',
      'quiz.correct': 'Correct! +20 coins and +20 XP',
      'quiz.incorrect': 'Not quite. The answer glows green.',
      'map.item.discovered': 'Discovered',
      'map.item.notfound': 'Not found',
      'live.discovered': 'Discovered {name}: +{coins} Viseu coins and {xp} XP',
      'live.exploring': 'Exploring {name} in the game map.',
      'live.found': 'Found {name}, plus {coins} coins',
      'storage.error': 'Progress could not be saved on this device. Check browser storage settings.',
      'health.unavailable': 'Health sync is not available in this web app. No health data is collected.',
      'health.title': 'Steps & reminders',
      'daily.earned': 'Claimed today',
      'trail.chapter.cava': 'Chapter 1 · Cava de Viriato',
      'trail.chapter.fontelo': 'Chapter 2 · Parque do Fontelo',
      'trail.chapter.cathedral': 'Chapter 3 · Sé & Centro Histórico',
      'trail.chapter.ecopista': 'Chapter 4 · Ecopista do Dão',
      'trail.sticker.cava': 'Viriato Warrior',
      'trail.sticker.fontelo': 'Fontelo Woods',
      'trail.sticker.cathedral': 'Granite Cathedral',
      'trail.sticker.ecopista': 'Dão Greenway',
      'trail.task.cava-stamp': 'Collect the Cava de Viriato stamp',
      'trail.task.cava-pickups': 'Find 5 map collectibles',
      'trail.task.cava-coins': 'Find 3 Viseu coins on the map',
      'trail.task.cava-quiz': 'Finish a landmark quiz',
      'trail.task.cava-checkin': 'Claim a daily check-in',
      'trail.task.fontelo-stamp': 'Collect the Fontelo stamp',
      'trail.task.fontelo-park': 'Visit Parque Aquilino Ribeiro',
      'trail.task.fontelo-pickups': 'Find 10 map collectibles',
      'trail.task.fontelo-quizzes': 'Finish 2 landmark quizzes',
      'trail.task.fontelo-streak': 'Build a 2-day check-in streak',
      'trail.task.cathedral-se': 'Collect the Sé Catedral stamp',
      'trail.task.cathedral-gv': 'Visit Museu Grão Vasco',
      'trail.task.cathedral-mis': 'Visit Igreja da Misericórdia',
      'trail.task.cathedral-quizzes': 'Finish 3 landmark quizzes',
      'trail.task.cathedral-streak': 'Build a 3-day check-in streak',
      'trail.task.ecopista-aq': 'Visit Parque Aquilino Ribeiro',
      'trail.task.ecopista-rossio': 'Visit Praça da República',
      'trail.task.ecopista-soar': 'Visit Porta do Soar',
      'trail.task.ecopista-collect': 'Find 20 map collectibles',
      'trail.task.ecopista-streak': 'Build a 7-day check-in streak',
      'item.coin': 'Viseu coin',
      'item.grape': 'Dão grapes',
      'item.chestnut': 'Castanhas',
      'item.tile': 'Azulejo tile',
      'item.flower': 'Garden flower',
      'item.shield': 'Viriato’s shield',
      'item.dice': 'Mystery dice',
      'item.compass': 'Golden compass',
      'item.token': 'Game token',
      'shop.skin.cap': 'Sunny cap',
      'shop.skin.viriato': 'Viriato helm',
      'shop.skin.dao': 'Dão wine',
      'shop.skin.azulejo': 'Azulejo blue'
    },
    pt: {
      'tour.eyebrow': 'APRENDA O JOGO',
      'tour.title': 'Visita rápida',
      'tour.subtitle': 'Descobre para que serve cada secção e como funciona a aventura.',
      'tour.button': 'Visita rápida',
      'account.eyebrow': 'CONTINUA A JOGAR',
      'account.title': 'Conta Studio',
      'account.subtitle': 'Entra para gerir a tua carteira e compras Studio. O progresso do jogo fica neste dispositivo.',
      'account.button': 'Criar conta / Entrar',
      'account.aria': 'Acesso à conta Studio',
      'language.aria': 'Escolha do idioma',
      'tour.step.map': 'Mapa',
      'tour.step.profile': 'Perfil',
      'tour.step.trails': 'Rotas',
      'tour.step.passport': 'Passaporte',
      'tour.step.collection': 'Coleção',
      'tour.step.avatar': 'Avatar',
      'tour.step.studio': 'Studio',
      'tour.step.map.detail': 'O mapa é o teu guia da cidade. Toca num ponto de interesse, desloca-te até lá e desbloqueia a marca e o quiz rápido dessa zona.',
      'tour.step.profile.detail': 'O perfil guarda o teu nome de explorador, o emblema e as definições de privacidade do mapa. Liga a localização só quando quiseres mostrá-la no mapa da cidade.',
      'tour.step.trails.detail': 'As rotas transformam a aventura em desafios: selos, quizzes, descobertas e desafios mais longos ajudam o teu progresso.',
      'tour.step.passport.detail': 'O passaporte guarda o registo de cada monumento que recolhes para veres quais os locais concluídos e os que ainda faltam.',
      'tour.step.collection.detail': 'A coleção acompanha recompensas, colecionáveis, moedas de descoberta e lembranças dos lugares que visitas em Viseu.',
      'tour.step.avatar.detail': 'Gasta moedas na loja do avatar para mudar a aparência do teu explorador e personalizar a identidade do jogo.',
      'tour.step.studio.detail': 'A loja Studio é onde exploras arte nova, vantagens de fundador e produtos digitais especiais criados para o mundo de Viseu.',
      'tour.back': 'Voltar',
      'tour.next': 'Próximo passo',
      'tour.finish': 'Terminar visita',
      'tour.goto': 'Ir para o passo {label}',
      'nav.map': 'Mapa',
      'nav.profile': 'Perfil',
      'nav.trails': 'Rotas',
      'nav.passport': 'Passaporte',
      'nav.collection': 'Coleção',
      'nav.avatar': 'Avatar',
      'nav.studio': 'Studio',
      'nav.main': 'Navegação principal',
      'home.tagline': 'Passeia pelo centro histórico, visita monumentos e coleciona selos.',
      'map.hint': 'Toca no mapa para explorar em ecrã inteiro. Mapa ilustrado, não está à escala.',
      'map.switch.game': 'Usar mapa do jogo',
      'map.switch.city': 'Usar mapa da cidade',
      'map.switch.street': 'Usar mapa de ruas',
      'map.unavailable': 'Mapa de ruas indisponível',
      'map.loaderror': 'Não foi possível carregar o mapa de ruas. O mapa ilustrado do jogo continua disponível.',
      'map.fullscreen.hint': 'Toca num marcador dourado para recolher uma moeda ou explorar o monumento no mapa do jogo.',
      'map.locate': 'Localizar-me',
      'map.close': 'Fechar mapa',
      'map.close.label': 'Fechar mapa em ecrã inteiro',
      'map.aria': 'Mapa ilustrado de Viseu. Toca num local para caminhar até lá ou usa as setas do teclado.',
      'map.city.aria': 'Mapa de ruas interativo centrado em Viseu',
      'home.made': 'Feito em Viseu, Portugal',
      'home.reset': 'Recomeçar',
      'screen.adventure': 'A TUA AVENTURA',
      'screen.passport': 'Passaporte de Viseu',
      'screen.passport.close': 'Fechar passaporte',
      'screen.profile': 'O teu perfil',
      'screen.profile.close': 'Fechar perfil',
      'profile.explorer': 'Nome de explorador',
      'profile.name.placeholder': 'Visitante curioso',
      'profile.badge': 'Emblema do perfil',
      'profile.badge.choose': 'Escolhe o emblema do perfil',
      'profile.badge.compass': 'Bússola',
      'profile.badge.star': 'Estrela',
      'profile.badge.leaf': 'Folha',
      'profile.badge.castle': 'Castelo',
      'profile.mapprivacy': 'Mapa e privacidade',
      'profile.device': 'Guardado neste dispositivo',
      'profile.location': 'Permitir localização no mapa da cidade',
      'profile.location.help': 'Desativada por predefinição. A localização só é pedida quando tocas em “Localizar-me” e fica neste dispositivo.',
      'profile.approx': 'Localização aproximada',
      'profile.approx.help': 'Mostrar uma área aproximada em vez da tua posição exata.',
      'profile.audience': 'Quem pode ver-te?',
      'profile.audience.help': 'Preferência para uma futura funcionalidade de amigos.',
      'profile.onlyme': 'Só eu',
      'profile.friends': 'Amigos',
      'profile.selected': 'Amigos selecionados',
      'profile.health': 'Passos e lembretes',
      'profile.health.help': 'A sincronização de passos requer Apple Health ou Health Connect e uma aplicação nativa. O GPS só é usado no mapa da cidade após a tua autorização; não é guardado nem enviado ao Viseu Quest.',
      'profile.health.button': 'Ver configuração de sincronização',
      'screen.trails.eyebrow': 'DESCOBRE VISEU',
      'screen.trails': 'Rotas de Viseu',
      'screen.trails.close': 'Fechar rotas',
      'screen.trails.intro': 'Conclui desafios com os locais, quizzes e colecionáveis do jogo. Não são registados passos nem GPS.',
      'daily.title': 'A aventura de hoje',
      'daily.streak': 'sequência de {count} dias',
      'daily.best': ' · recorde {count}',
      'daily.headline.perfect': 'Semana perfeita!',
      'daily.headline.checked': 'Já fizeste o check-in hoje',
      'daily.headline.default': 'Cada passo conta',
      'daily.subline.perfect': 'Sete check-ins seguidos · +50 moedas e +30 XP',
      'daily.subline.checked': 'Muito bem. A tua sequência está segura por hoje.',
      'daily.subline.default': 'Faz o check-in quando quiseres. Não há penalizações por falhar dias.',
      'daily.claimed': 'Reclamado hoje',
      'daily.claim': 'Fazer check-in · +10 moedas',
      'screen.collection': 'Coleção',
      'screen.collection.close': 'Fechar coleção',
      'collection.city': 'Descobertas no mapa da cidade',
      'screen.avatar.eyebrow': 'PERSONALIZA O TEU EXPLORADOR',
      'screen.avatar': 'Loja de avatares',
      'screen.avatar.close': 'Fechar loja de avatares',
      'avatar.spend': 'Usa as tuas moedas de Viseu',
      'studio.close': 'Fechar Studio Shop',
      'studio.eyebrow': 'FEITO NO STUDIO DE VISEU',
      'studio.title': 'Pequenos detalhes, grandes aventuras.',
      'studio.subtitle': 'Uma coleção colorida de criadores de Viseu.',
      'studio.balance': 'O TEU SALDO',
      'studio.coins': 'Moedas de Viseu',
      'studio.signin': 'Entrar',
      'studio.signout': 'Sair',
      'studio.email.label': 'Entrar com um link enviado por email',
      'studio.email.send': 'Enviar link',
      'studio.category.all': 'Tudo',
      'studio.category.founder': 'Passe de Fundador',
      'studio.category.art': 'Pacotes de Arte Grão Vasco',
      'studio.category.streak': 'Bónus de Sequência',
      'studio.footnote': 'As compras são protegidas pelo Stripe. Os artigos digitais ficam na tua coleção.',
      'modal.close': 'Fechar',
      'sound.on': 'Som ligado',
      'sound.off': 'Som desligado',
      'count.stamps': '{count} de 8 selos',
      'reward.stamp': 'Selo recolhido',
      'reward.coins': 'moedas',
      'crate.title': 'Uma caixa de azulejos!',
      'crate.reveal': 'Chegaste a {name}. Abre a caixa para revelar o teu selo.',
      'crate.open': 'Abrir a caixa',
      'quiz.feedback.correct': 'Correto! +20 moedas e +20 XP',
      'quiz.feedback.incorrect': 'Não é bem isso. A resposta correta está a verde.',
      'quiz.keep': 'Continuar a explorar',
      'stamp.all': 'Todos os selos!',
      'reward.chest': 'Baú do tesouro! +100 moedas',
      'reward.legend': 'Lenda de Viseu +100 moedas',
      'reward.level': 'Nível {level}: {title}',
      'level.1': 'Visitante curioso',
      'level.2': 'Explorador urbano',
      'level.3': 'Guia local',
      'level.4': 'Herói da colina',
      'level.5': 'Lenda de Viseu',
      'dock.welcome': 'Bem-vindo de volta a {name}',
      'dock.at': 'Estás em {name}',
      'dock.stamp.quiz': 'Selo recolhido e quiz concluído.',
      'dock.stamp.pending': 'Selo recolhido. Ainda podes fazer o quiz para ganhar moedas extra.',
      'dock.checkin': 'Faz check-in para ganhar um selo, XP e moedas.',
      'dock.open': 'Abrir',
      'dock.checkin.button': 'Fazer check-in',
      'dock.legend': 'Lenda de Viseu!',
      'dock.allstamps': 'Recolheste os 8 selos. Continua a explorar para encontrar moedas e uvas.',
      'dock.next': 'Próxima paragem: {name}',
      'dock.steps': 'A cerca de {count} passos. Recolhe moedas pelo caminho.',
      'dock.walk': 'Caminhar até lá',
      'stamp.quiz.done': 'Selo e quiz concluídos',
      'stamp.done': 'Selo recolhido',
      'stamp.notvisited': 'Ainda não visitado',
      'action.startover.confirm': 'Toca novamente para apagar todo o progresso',
      'daily.challenge.pickups': 'Encontra 3 colecionáveis no mapa',
      'daily.challenge.stamp': 'Ganha um selo de monumento',
      'daily.challenge.quiz': 'Conclui um quiz de monumento',
      'daily.challenge.checkin': 'Reclama o check-in de hoje',
      'daily.challenge.collect-five': 'Encontra 5 colecionáveis hoje',
      'daily.challenge.claimed': 'Reclamado',
      'daily.challenge.claim': 'Reclamar',
      'daily.challenge.progress': 'Em progresso',
      'trail.unlocked': 'Rota de Viseu',
      'trail.locked': 'CAPÍTULO BLOQUEADO',
      'trail.claimed': 'Autocolante reclamado',
      'trail.complete': 'Conclui {required} de {total} para reclamar a recompensa do capítulo',
      'trail.previous': 'Reclama a recompensa do capítulo anterior para continuar',
      'trail.sticker.collected': 'Autocolante recolhido',
      'trail.sticker.claim': 'Reclamar autocolante · +50 moedas',
      'trail.keep': 'Continua a explorar',
      'collection.picked': '{found} de {total} recolhidos no mapa',
      'collection.discovered': '{found} de {total} descobertos',
      'collection.notfound': 'Ainda não encontrado',
      'avatar.wearing': 'A usar',
      'avatar.owned': 'Adquirido',
      'avatar.buy': 'Comprar',
      'avatar.wear': 'Usar',
      'avatar.need': 'Faltam {count} moedas para {name}',
      'avatar.nowwearing': 'Agora estás a usar {name}',
      'action.quiz': 'Quiz rápido: +20 moedas',
      'action.later': 'Mais tarde',
      'action.close': 'Fechar',
      'action.quizkeep': 'Continuar a explorar',
      'quiz.title': 'Quiz rápido',
      'quiz.correct': 'Correto! +20 moedas e +20 XP',
      'quiz.incorrect': 'Não é bem isso. A resposta correta está a verde.',
      'map.item.discovered': 'Descoberto',
      'map.item.notfound': 'Ainda não encontrado',
      'live.discovered': 'Descoberta: {name} · +{coins} moedas de Viseu e +{xp} XP',
      'live.exploring': 'A explorar {name} no mapa do jogo.',
      'live.found': 'Encontraste {name} e mais {coins} moedas',
      'storage.error': 'Não foi possível guardar o progresso neste dispositivo. Verifica as definições de armazenamento do navegador.',
      'health.unavailable': 'A sincronização de saúde não está disponível nesta aplicação web. Não são recolhidos dados de saúde.',
      'health.title': 'Passos e lembretes',
      'daily.earned': 'Reclamado hoje'
      ,'trail.chapter.cava': 'Capítulo 1 · Cava de Viriato',
      'trail.chapter.fontelo': 'Capítulo 2 · Parque do Fontelo',
      'trail.chapter.cathedral': 'Capítulo 3 · Sé e Centro Histórico',
      'trail.chapter.ecopista': 'Capítulo 4 · Ecopista do Dão',
      'trail.sticker.cava': 'Guerreiro Viriato',
      'trail.sticker.fontelo': 'Bosques do Fontelo',
      'trail.sticker.cathedral': 'Catedral de Granito',
      'trail.sticker.ecopista': 'Ecopista do Dão',
      'trail.task.cava-stamp': 'Recolhe o selo da Cava de Viriato',
      'trail.task.cava-pickups': 'Encontra 5 colecionáveis no mapa',
      'trail.task.cava-coins': 'Encontra 3 moedas de Viseu no mapa',
      'trail.task.cava-quiz': 'Conclui um quiz de monumento',
      'trail.task.cava-checkin': 'Reclama um check-in diário',
      'trail.task.fontelo-stamp': 'Recolhe o selo do Fontelo',
      'trail.task.fontelo-park': 'Visita o Parque Aquilino Ribeiro',
      'trail.task.fontelo-pickups': 'Encontra 10 colecionáveis no mapa',
      'trail.task.fontelo-quizzes': 'Conclui 2 quizzes de monumentos',
      'trail.task.fontelo-streak': 'Cria uma sequência de check-in de 2 dias',
      'trail.task.cathedral-se': 'Recolhe o selo da Sé Catedral',
      'trail.task.cathedral-gv': 'Visita o Museu Grão Vasco',
      'trail.task.cathedral-mis': 'Visita a Igreja da Misericórdia',
      'trail.task.cathedral-quizzes': 'Conclui 3 quizzes de monumentos',
      'trail.task.cathedral-streak': 'Cria uma sequência de check-in de 3 dias',
      'trail.task.ecopista-aq': 'Visita o Parque Aquilino Ribeiro',
      'trail.task.ecopista-rossio': 'Visita a Praça da República',
      'trail.task.ecopista-soar': 'Visita a Porta do Soar',
      'trail.task.ecopista-collect': 'Encontra 20 colecionáveis no mapa',
      'trail.task.ecopista-streak': 'Cria uma sequência de check-in de 7 dias',
      'item.coin': 'Moeda de Viseu',
      'item.grape': 'Uvas do Dão',
      'item.chestnut': 'Castanhas',
      'item.tile': 'Azulejo',
      'item.flower': 'Flor de jardim',
      'item.shield': 'Escudo de Viriato',
      'item.dice': 'Dado misterioso',
      'item.compass': 'Bússola dourada',
      'item.token': 'Ficha de jogo',
      'shop.skin.cap': 'Boné solarengo',
      'shop.skin.viriato': 'Elmo de Viriato',
      'shop.skin.dao': 'Vinho do Dão',
      'shop.skin.azulejo': 'Azul azulejo'
    }
  };
  function t(key) { return (I18N[locale] && I18N[locale][key]) || I18N.en[key] || key; }
  function tKey(key, fallback) {
    var localized = t(key);
    return localized === key ? fallback : localized;
  }
  function tr(key, values) {
    return t(key).replace(/\{(\w+)\}/g, function (match, name) {
      return values && values[name] !== undefined ? values[name] : match;
    });
  }
  function setLocale(nextLocale) {
    if (!I18N[nextLocale]) return;
    locale = nextLocale;
    try { localStorage.setItem(LANG_KEY, locale); } catch (e) {}
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach(function (mapping) {
        var parts = mapping.split(':');
        if (parts.length === 2) el.setAttribute(parts[0], t(parts[1]));
      });
    });
    document.documentElement.lang = locale === 'pt' ? 'pt-PT' : 'en';
    document.querySelectorAll('.lang-btn').forEach(function (button) {
      var active = button.getAttribute('data-lang') === locale;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    window.dispatchEvent(new CustomEvent('viseu:languagechange', { detail: { locale: locale } }));
    if (typeof renderHud === 'function') renderHud();
    if (typeof renderDock === 'function') renderDock();
    if (typeof renderGrid === 'function') renderGrid();
    if (typeof renderDaily === 'function') renderDaily();
    if (typeof renderTrails === 'function') renderTrails();
    if (typeof renderItems === 'function') renderItems();
    if (typeof renderShop === 'function') renderShop();
    if (typeof renderProfile === 'function') renderProfile();
    if (typeof SPOTS !== 'undefined' && typeof spotEls !== 'undefined') {
      SPOTS.forEach(function (spot) {
        var label = spotEls[spot.id] && spotEls[spot.id].querySelector('text');
        if (label) label.textContent = spotText(spot, 'name');
      });
    }
    if (modalOpen && mBody && mBody.innerHTML.indexOf('quick-tour-wrap') !== -1) {
      renderQuickTour(quickTourIndex);
    }
  }
  var $ = function (s) { return document.querySelector(s); };
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ---------- Content ---------- */
  var SPOTS = [
    { id: 'se', name: 'Sé Catedral', x: 500, y: 300, color: '#7a5cff', type: 'cathedral',
      fact: 'Viseu’s cathedral crowns a hilltop square. Look up inside for stone ribs carved like twisted rope.',
      q: 'What style is the famous rope-like vaulted ceiling?', o: ['Manueline', 'Art Deco', 'Brutalist'], a: 0 },
    { id: 'gv', name: 'Museu Grão Vasco', x: 440, y: 335, color: '#ff5d73', type: 'museum',
      fact: 'The national museum honours Vasco Fernandes, known as Grão Vasco, a star of 16th-century Portuguese painting.',
      q: 'Grão Vasco was best known as a…', o: ['Navigator', 'Painter', 'Architect'], a: 1 },
    { id: 'mis', name: 'Igreja da Misericórdia', x: 548, y: 338, color: '#3cc3f3', type: 'church',
      fact: 'A white baroque church from the 1700s, standing across the square from the cathedral.',
      q: 'Which landmark does it face?', o: ['The Fontelo palace', 'The cathedral', 'The Cava'], a: 1 },
    { id: 'soar', name: 'Porta do Soar', x: 400, y: 408, color: '#ff9f1c', type: 'gate',
      fact: 'A medieval gateway that reminds you Viseu once sat behind walls.',
      q: 'The Porta do Soar was part of the town’s old…', o: ['Railway', 'Aqueduct', 'City walls'], a: 2 },
    { id: 'rossio', name: 'Praça da República', x: 320, y: 440, color: '#1fbfae', type: 'square',
      fact: 'The lively heart of town, where streets meet and people gather under the trees.',
      q: 'Locals nickname this square…', o: ['Rossio', 'Terreiro', 'Largo da Sé'], a: 0 },
    { id: 'aq', name: 'Parque Aquilino Ribeiro', x: 150, y: 485, color: '#4cb963', type: 'park',
      fact: 'Lawns, shady paths and benches in a park named for the Portuguese writer Aquilino Ribeiro.',
      q: 'Aquilino Ribeiro was a famous…', o: ['Football coach', 'Writer', 'Chef'], a: 1 },
    { id: 'fon', name: 'Parque do Fontelo', x: 790, y: 300, color: '#ee6c4d', type: 'palace',
      fact: 'A big green park beside the Paço dos Três Escalões, a former bishops’ palace.',
      q: 'What does “Três Escalões” mean?', o: ['Three steps', 'Three towers', 'Three gardens'], a: 0 },
    { id: 'cava', name: 'Cava de Viriato', x: 560, y: 112, color: '#8d6e63', type: 'earth',
      fact: 'An eight-sided earthwork at the edge of town, linked by tradition to the Lusitanian leader Viriato.',
      q: 'What shape is the Cava de Viriato?', o: ['Octagon', 'Circle', 'Triangle'], a: 0 }
  ];
  var SPOT_PT = {
    se: { name: 'Sé Catedral', fact: 'A Sé de Viseu domina uma praça no alto da colina. No interior, observa as nervuras de pedra da abóbada, esculpidas como cordas torcidas.', q: 'Qual é o estilo da famosa abóbada com aspeto de cordas?', o: ['Manuelino', 'Art Déco', 'Brutalista'] },
    gv: { name: 'Museu Grão Vasco', fact: 'O museu nacional homenageia Vasco Fernandes, conhecido como Grão Vasco, uma referência da pintura portuguesa do século XVI.', q: 'Grão Vasco era sobretudo…', o: ['Navegador', 'Pintor', 'Arquiteto'] },
    mis: { name: 'Igreja da Misericórdia', fact: 'Uma igreja barroca branca do século XVIII, situada em frente à Sé Catedral.', q: 'Que monumento fica em frente à igreja?', o: ['O Paço do Fontelo', 'A Sé Catedral', 'A Cava'] },
    soar: { name: 'Porta do Soar', fact: 'Uma porta medieval que recorda que Viseu já foi uma cidade muralhada.', q: 'A Porta do Soar fazia parte das antigas…', o: ['Linhas ferroviárias', 'Aquedutos', 'Muralhas da cidade'] },
    rossio: { name: 'Praça da República', fact: 'O coração animado da cidade, onde as ruas se cruzam e as pessoas se reúnem à sombra das árvores.', q: 'Qual é a alcunha local desta praça?', o: ['Rossio', 'Terreiro', 'Largo da Sé'] },
    aq: { name: 'Parque Aquilino Ribeiro', fact: 'Relvados, caminhos à sombra e bancos num parque com o nome do escritor português Aquilino Ribeiro.', q: 'Aquilino Ribeiro foi um…', o: ['Treinador de futebol', 'Escritor', 'Cozinheiro'] },
    fon: { name: 'Parque do Fontelo', fact: 'Um grande parque junto ao Paço dos Três Escalões, antigo paço dos bispos.', q: 'O que significa “Três Escalões”?', o: ['Três degraus', 'Três torres', 'Três jardins'] },
    cava: { name: 'Cava de Viriato', fact: 'Uma estrutura de terra octogonal nos arredores da cidade, tradicionalmente associada ao líder lusitano Viriato.', q: 'Que forma tem a Cava de Viriato?', o: ['Octógono', 'Círculo', 'Triângulo'] }
  };
  function spotText(spot, field) {
    return locale === 'pt' && SPOT_PT[spot.id] ? SPOT_PT[spot.id][field] || spot[field] : spot[field];
  }
  var ROADS = [
    [[320, 440], [400, 408], [440, 335], [500, 300], [548, 338]],
    [[500, 300], [520, 205], [560, 112]],
    [[548, 338], [650, 312], [790, 300]],
    [[320, 440], [230, 472], [150, 485]],
    [[790, 300], [850, 380], [880, 440]],
    [[400, 408], [470, 470], [560, 500], [700, 440], [850, 380]]
  ];
  var ITEMS = [
    [360, 424], [420, 372], [470, 312], [524, 318], [512, 250], [540, 158], [598, 322], [724, 306],
    [824, 340], [276, 456], [190, 476], [866, 408], [470, 470], [620, 490]
  ].map(function (p, i) { return { id: 'c' + i, x: p[0], y: p[1], v: 1, t: 'coin' }; })
   .concat([[700, 430], [330, 255], [120, 300]].map(function (p, i) { return { id: 'g' + i, x: p[0], y: p[1], v: 5, t: 'grape' }; }))
   .concat([
     ['shield', 610, 172, 8], ['chestnut', 360, 300, 3], ['chestnut', 255, 520, 3], ['chestnut', 740, 380, 3],
     ['tile', 455, 262, 6], ['tile', 690, 350, 6], ['tile', 232, 410, 6],
     ['dice', 338, 420, 0], ['dice', 300, 478, 0], ['compass', 480, 384, 15],
     ['token', 270, 445, 3], ['token', 345, 458, 3],
     ['flower', 760, 330, 2], ['flower', 830, 270, 2], ['flower', 170, 450, 2], ['flower', 105, 525, 2]
   ].map(function (p, i) { return { id: 'k' + i, x: p[1], y: p[2], v: p[3], t: p[0] }; }));
  var TYPES = { coin: 'Viseu coin', grape: 'Dão grapes', chestnut: 'Castanhas', tile: 'Azulejo tile', flower: 'Garden flower', shield: 'Viriato’s shield', dice: 'Mystery dice', compass: 'Golden compass', token: 'Game token' };
  var PRIZE = { se: 'compass', gv: 'tile', mis: 'tile', soar: 'shield', rossio: 'token', aq: 'flower', fon: 'chestnut', cava: 'shield' };
  function itemIcon(t) {
    var d = INK;
    switch (t) {
      case 'coin': return '<circle r="10" fill="#ffc93c" stroke="#e59a00" stroke-width="3"/><rect x="-1.8" y="-5" width="3.6" height="10" rx="1.5" fill="#e59a00"/>';
      case 'grape': return [[-5, -6], [5, -6], [0, -1], [-5, 4], [5, 4], [0, 9]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#7a5cff" stroke="#5a3fd6" stroke-width="1.5"/>'; }).join('') + '<path d="M0 -10 Q7 -20 12 -13 Q6 -9 0 -10Z" fill="#4cb963"/>';
      case 'shield': return '<path d="M0 -12 L11 -8 V2 Q11 10 0 14 Q-11 10 -11 2 V-8Z" fill="#e2703a" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/><path d="M0 -12 V14" stroke="#ffc93c" stroke-width="3"/><circle cy="-1" r="3.5" fill="#ffc93c"/>';
      case 'chestnut': return '<path d="M-9 2 Q-9 -10 0 -10 Q9 -10 9 2 Q9 10 0 10 Q-9 10 -9 2Z" fill="#8d5a3b" stroke="' + d + '" stroke-width="2"/><path d="M-3 -10 Q0 -14 3 -10Z" fill="#5a3a24"/><ellipse cx="-3" cy="-2" rx="2.5" ry="4" fill="#b98255"/>';
      case 'tile': return '<rect x="-11" y="-11" width="22" height="22" rx="3" fill="#fff" stroke="#1f5fbf" stroke-width="2.5"/><path d="M0 -8 L8 0 L0 8 L-8 0Z" fill="#1f5fbf"/><circle r="3" fill="#fff"/>';
      case 'flower': return [0, 72, 144, 216, 288].map(function (a) { var r = a * Math.PI / 180; return '<circle cx="' + (Math.cos(r) * 6.5).toFixed(1) + '" cy="' + (Math.sin(r) * 6.5).toFixed(1) + '" r="5" fill="#ff5d73" stroke="' + d + '" stroke-width="1.5"/>'; }).join('') + '<circle r="3.5" fill="#ffc93c" stroke="' + d + '" stroke-width="1.5"/>';
      case 'dice': return '<rect x="-10" y="-10" width="20" height="20" rx="5" fill="#fff" stroke="' + d + '" stroke-width="2.5"/>' + [[-4, -4], [4, 4], [0, 0], [4, -4], [-4, 4]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="#ff5d73"/>'; }).join('');
      case 'compass': return '<rect x="-2" y="-15" width="4" height="4" rx="1" fill="' + d + '"/><circle r="11" fill="#ffc93c" stroke="' + d + '" stroke-width="2.5"/><circle r="7.5" fill="#fff"/><path d="M0 -6 L2.5 0 L0 6 L-2.5 0Z" fill="#e2703a"/><circle r="1.5" fill="' + d + '"/>';
      case 'token': return '<circle cy="-6" r="5" fill="#7a5cff" stroke="' + d + '" stroke-width="2"/><path d="M-4 -2 L-8 10 H8 L4 -2Z" fill="#7a5cff" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/>';
    }
    return '';
  }
  var TITLES = ['Curious Visitor', 'Street Wanderer', 'Local Guide', 'Hilltop Hero', 'Viseu Legend'];

  /* ---------- State ---------- */
  function fresh() {
    return {
      xp: 0, coins: 0, stamps: {}, got: {}, quiz: {}, chests: {}, mute: false, items: {}, skins: { cap: 1 }, skin: 'cap',
      profile: { name: '', avatar: '🧭', shareLocation: false, approximateLocation: true, audience: 'private' },
      daily: { date: '', lastCheckin: '', streak: 0, bestStreak: 0, lastPerfectWeek: 0, stats: { pickups: 0, stamps: 0, quizzes: 0 }, claims: {} },
      trails: { claimed: {} }
    };
  }
  function dateKey(date) {
    return date.toISOString().slice(0, 10);
  }
  function ensureDailyState(state) {
    var defaults = fresh();
    state.profile = Object.assign({}, defaults.profile, state.profile || {});
    state.daily = Object.assign({}, defaults.daily, state.daily || {});
    state.daily.stats = Object.assign({}, defaults.daily.stats, state.daily.stats || {});
    state.daily.claims = Object.assign({}, defaults.daily.claims, state.daily.claims || {});
    state.trails = Object.assign({}, defaults.trails, state.trails || {});
    state.trails.claimed = Object.assign({}, defaults.trails.claimed, state.trails.claimed || {});
    if (state.daily.date !== dateKey(new Date())) {
      state.daily.date = dateKey(new Date());
      state.daily.stats = { pickups: 0, stamps: 0, quizzes: 0 };
      state.daily.claims = {};
    }
    return state;
  }
  function load() {
    try {
      var j = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (j && typeof j === 'object') { var s = fresh(); for (var k in s) if (j[k] !== undefined) s[k] = j[k]; return ensureDailyState(s); }
    } catch (e) {}
    return ensureDailyState(fresh());
  }
  var S = load();
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
      console.warn('Viseu Quest progress could not be saved in this browser.', e);
      var live = $('#live');
      if (live) live.textContent = t('storage.error');
    }
  }
  function level() { return Math.floor(S.xp / 100) + 1; }
  function stampCount() { return SPOTS.filter(function (s) { return S.stamps[s.id]; }).length; }
  var DAILY_CHALLENGES = [
    { id: 'pickups', title: 'Find 3 map collectibles', reward: 8, xp: 10, progress: function () { return Math.min(3, S.daily.stats.pickups); }, goal: 3 },
    { id: 'stamp', title: 'Earn a landmark stamp', reward: 10, xp: 15, progress: function () { return Math.min(1, S.daily.stats.stamps); }, goal: 1 },
    { id: 'quiz', title: 'Finish a landmark quiz', reward: 8, xp: 10, progress: function () { return Math.min(1, S.daily.stats.quizzes); }, goal: 1 },
    { id: 'checkin', title: 'Claim today’s check-in', reward: 6, xp: 8, progress: function () { return S.daily.lastCheckin === dateKey(new Date()) ? 1 : 0; }, goal: 1 },
    { id: 'collect-five', title: 'Find 5 collectibles today', reward: 12, xp: 15, progress: function () { return Math.min(5, S.daily.stats.pickups); }, goal: 5 }
  ];
  function activeDailyChallenges() {
    var dayNumber = Math.floor(Date.parse(dateKey(new Date()) + 'T00:00:00Z') / 86400000);
    var first = (dayNumber * 3) % DAILY_CHALLENGES.length;
    return [0, 1, 2].map(function (offset) { return DAILY_CHALLENGES[(first + offset) % DAILY_CHALLENGES.length]; });
  }
  var TRAILS = [
    {
      id: 'cava', title: 'Chapter 1 · Cava de Viriato', sticker: 'Viriato Warrior',
      tasks: [
        { id: 'cava-stamp', label: 'Collect the Cava de Viriato stamp', done: function () { return Boolean(S.stamps.cava); } },
        { id: 'cava-pickups', label: 'Find 5 map collectibles', done: function () { return Object.keys(S.got).length >= 5; } },
        { id: 'cava-coins', label: 'Find 3 Viseu coins on the map', done: function () { return ITEMS.concat(CITY_MAP_ITEMS).filter(function (item) { return item.t === 'coin' && S.got[item.id]; }).length >= 3; } },
        { id: 'cava-quiz', label: 'Finish a landmark quiz', done: function () { return Object.keys(S.quiz).length >= 1; } },
        { id: 'cava-checkin', label: 'Claim a daily check-in', done: function () { return S.daily.streak >= 1; } }
      ]
    },
    {
      id: 'fontelo', title: 'Chapter 2 · Parque do Fontelo', sticker: 'Fontelo Woods',
      tasks: [
        { id: 'fontelo-stamp', label: 'Collect the Fontelo stamp', done: function () { return Boolean(S.stamps.fon); } },
        { id: 'fontelo-park', label: 'Visit Parque Aquilino Ribeiro', done: function () { return Boolean(S.stamps.aq); } },
        { id: 'fontelo-pickups', label: 'Find 10 map collectibles', done: function () { return Object.keys(S.got).length >= 10; } },
        { id: 'fontelo-quizzes', label: 'Finish 2 landmark quizzes', done: function () { return Object.keys(S.quiz).length >= 2; } },
        { id: 'fontelo-streak', label: 'Build a 2-day check-in streak', done: function () { return S.daily.bestStreak >= 2; } }
      ]
    },
    {
      id: 'cathedral', title: 'Chapter 3 · Sé & Centro Histórico', sticker: 'Granite Cathedral',
      tasks: [
        { id: 'cathedral-se', label: 'Collect the Sé Catedral stamp', done: function () { return Boolean(S.stamps.se); } },
        { id: 'cathedral-gv', label: 'Visit Museu Grão Vasco', done: function () { return Boolean(S.stamps.gv); } },
        { id: 'cathedral-mis', label: 'Visit Igreja da Misericórdia', done: function () { return Boolean(S.stamps.mis); } },
        { id: 'cathedral-quizzes', label: 'Finish 3 landmark quizzes', done: function () { return Object.keys(S.quiz).length >= 3; } },
        { id: 'cathedral-streak', label: 'Build a 3-day check-in streak', done: function () { return S.daily.bestStreak >= 3; } }
      ]
    },
    {
      id: 'ecopista', title: 'Chapter 4 · Ecopista do Dão', sticker: 'Dão Greenway',
      tasks: [
        { id: 'ecopista-aq', label: 'Visit Parque Aquilino Ribeiro', done: function () { return Boolean(S.stamps.aq); } },
        { id: 'ecopista-rossio', label: 'Visit Praça da República', done: function () { return Boolean(S.stamps.rossio); } },
        { id: 'ecopista-soar', label: 'Visit Porta do Soar', done: function () { return Boolean(S.stamps.soar); } },
        { id: 'ecopista-collect', label: 'Find 20 map collectibles', done: function () { return Object.keys(S.got).length >= 20; } },
        { id: 'ecopista-streak', label: 'Build a 7-day check-in streak', done: function () { return S.daily.bestStreak >= 7; } }
      ]
    }
  ];

  function renderProfile() {
    var name = S.profile.name.trim() || t('level.' + Math.min(level(), TITLES.length));
    $('#profileName').value = S.profile.name;
    $('#profileAvatar').textContent = S.profile.avatar;
    $('#profileLevel').textContent = name + ' · ' + (locale === 'pt' ? 'Nível ' : 'Level ') + level();
    $('#shareLocation').checked = S.profile.shareLocation;
    $('#approxLocation').checked = S.profile.approximateLocation;
    $('#locationAudience').value = S.profile.audience;
  }
  function rollDaily() {
    var day = dateKey(new Date());
    if (S.daily.date !== day) {
      S.daily.date = day;
      S.daily.stats = { pickups: 0, stamps: 0, quizzes: 0 };
      S.daily.claims = {};
      save();
    }
  }
  function renderDaily() {
    rollDaily();
    var day = dateKey(new Date());
    var checkedIn = S.daily.lastCheckin === day;
    var yesterday = dateKey(new Date(Date.now() - 86400000));
    var currentStreak = S.daily.lastCheckin === day || S.daily.lastCheckin === yesterday ? S.daily.streak : 0;
    $('#streakCount').textContent = tr('daily.streak', { count: currentStreak }) + (S.daily.bestStreak > currentStreak ? tr('daily.best', { count: S.daily.bestStreak }) : '');
    var perfectWeek = checkedIn && S.daily.streak > 0 && S.daily.streak % 7 === 0;
    $('#dailyHeadline').textContent = perfectWeek ? t('daily.headline.perfect') : checkedIn ? t('daily.headline.checked') : t('daily.headline.default');
    $('#dailySubline').textContent = perfectWeek
      ? t('daily.subline.perfect')
      : checkedIn ? t('daily.subline.checked') : t('daily.subline.default');
    var checkin = $('#dailyCheckin');
    checkin.disabled = checkedIn;
    checkin.textContent = checkedIn ? t('daily.claimed') : t('daily.claim');
    $('#dailyChallenges').innerHTML = activeDailyChallenges().map(function (challenge) {
      var progress = challenge.progress(), complete = progress >= challenge.goal, claimed = Boolean(S.daily.claims[challenge.id]);
      return '<article class="daily-challenge' + (claimed ? ' is-claimed' : '') + '"><span class="challenge-mark">' + (claimed ? '✓' : complete ? '★' : '•') + '</span><div class="challenge-copy"><strong>' + t('daily.challenge.' + challenge.id) + '</strong><small>' + progress + '/' + challenge.goal + ' · +' + challenge.reward + (locale === 'pt' ? ' moedas' : ' coins') + ' · +' + challenge.xp + ' XP</small></div>' +
        (claimed ? '<span class="challenge-done">' + t('daily.challenge.claimed') + '</span>' : '<button class="challenge-claim" type="button" data-daily-claim="' + challenge.id + '"' + (complete ? '' : ' disabled') + '>' + (complete ? t('daily.challenge.claim') : t('daily.challenge.progress')) + '</button>') + '</article>';
    }).join('');
  }
  function renderTrails() {
    var previousComplete = true;
    $('#trailList').innerHTML = TRAILS.map(function (chapter) {
      var tasks = chapter.tasks.map(function (task) { return { id: task.id, label: t('trail.task.' + task.id), done: task.done() }; });
      var completeCount = tasks.filter(function (task) { return task.done; }).length;
      var unlocked = previousComplete;
      var claimed = Boolean(S.trails.claimed[chapter.id]);
      var canClaim = unlocked && completeCount >= Math.ceil(tasks.length * .8);
      var required = Math.ceil(tasks.length * .8);
      var card = '<section class="trail-card' + (unlocked ? '' : ' is-locked') + '"><header><div><span class="screen-eyebrow">' + (unlocked ? t('trail.unlocked') : t('trail.locked')) + '</span><h3>' + t('trail.chapter.' + chapter.id) + '</h3></div><span class="trail-sticker">' + (claimed ? '✓ ' : '') + t('trail.sticker.' + chapter.id) + '</span></header>' +
        '<p class="trail-progress-label">' + completeCount + ' / ' + tasks.length + (locale === 'pt' ? ' desafios · ' : ' challenges · ') + (claimed ? t('trail.claimed') : unlocked ? tr('trail.complete', { required: required, total: tasks.length }) : t('trail.previous')) + '</p><div class="trail-task-list">' +
        tasks.map(function (task) { return '<div class="trail-task' + (task.done ? ' is-done' : '') + '"><span>' + (task.done ? '✓' : '○') + '</span>' + task.label + '</div>'; }).join('') +
        '</div><button class="btn' + (canClaim && !claimed ? ' go' : ' ghost') + ' trail-claim" type="button" data-trail-claim="' + chapter.id + '"' + (canClaim && !claimed ? '' : ' disabled') + '>' +
        (claimed ? t('trail.sticker.collected') : canClaim ? t('trail.sticker.claim') : t('trail.keep')) + '</button></section>';
      previousComplete = claimed;
      return card;
    }).join('');
  }
  function claimCheckin() {
    rollDaily();
    var today = dateKey(new Date());
    if (S.daily.lastCheckin === today) return;
    var yesterday = dateKey(new Date(Date.now() - 86400000));
    S.daily.streak = S.daily.lastCheckin === yesterday ? S.daily.streak + 1 : 1;
    S.daily.bestStreak = Math.max(S.daily.bestStreak, S.daily.streak);
    S.daily.lastCheckin = today;
    S.coins += 10;
    addXp(15);
    if (S.daily.streak % 7 === 0 && S.daily.lastPerfectWeek < S.daily.streak) {
      S.daily.lastPerfectWeek = S.daily.streak;
      S.coins += 50;
      addXp(30);
    }
    flushPendingCelebrate();
    save();
    renderHud();
    renderDaily();
    renderTrails();
  }
  function claimDailyChallenge(id) {
    rollDaily();
    var challenge = activeDailyChallenges().filter(function (item) { return item.id === id; })[0];
    if (!challenge || S.daily.claims[id] || challenge.progress() < challenge.goal) return;
    S.daily.claims[id] = 1;
    S.coins += challenge.reward;
    addXp(challenge.xp);
    flushPendingCelebrate();
    save();
    renderHud();
    renderDaily();
    renderTrails();
    blip([660, 880, 1100], .08);
  }
  function claimTrail(id) {
    var index = TRAILS.map(function (chapter) { return chapter.id; }).indexOf(id);
    var chapter = TRAILS[index];
    if (!chapter || S.trails.claimed[id]) return;
    if (index > 0 && !S.trails.claimed[TRAILS[index - 1].id]) return;
    var done = chapter.tasks.filter(function (task) { return task.done(); }).length;
    if (done < Math.ceil(chapter.tasks.length * .8)) return;
    S.trails.claimed[id] = 1;
    S.coins += 50;
    addXp(50);
    flushPendingCelebrate();
    save();
    renderHud();
    renderTrails();
    blip([523, 659, 784, 1046], .09);
  }

  /* ---------- Sound ---------- */
  var AC = null;
  function blip(freqs, dur) {
    if (S.mute) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var t = AC.currentTime;
      freqs.forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * dur);
        g.gain.exponentialRampToValueAtTime(0.18, t + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * dur + dur);
        o.connect(g); g.connect(AC.destination);
        o.start(t + i * dur); o.stop(t + i * dur + dur + 0.02);
      });
    } catch (e) {}
  }

  /* ---------- Icons ---------- */
  function icon(type, c) {
    var d = INK, sw = 'stroke="' + d + '" stroke-width="2.5" stroke-linejoin="round"';
    switch (type) {
      case 'cathedral':
        return '<rect x="-22" y="-6" width="44" height="26" rx="3" fill="#fff" ' + sw + '/>' +
          '<rect x="-27" y="-22" width="15" height="42" rx="3" fill="' + c + '" ' + sw + '/><rect x="12" y="-22" width="15" height="42" rx="3" fill="' + c + '" ' + sw + '/>' +
          '<path d="M-28 -22 L-19.5 -40 L-11 -22Z M11 -22 L19.5 -40 L28 -22Z" fill="' + d + '"/><path d="M-6 20 V7 a6 6 0 0 1 12 0 V20Z" fill="' + d + '"/>' +
          '<circle cx="0" cy="-10" r="4" fill="' + c + '" ' + sw + '/>';
      case 'museum':
        return '<path d="M-30 -6 L0 -28 L30 -6Z" fill="' + c + '" ' + sw + '/><rect x="-28" y="-6" width="56" height="6" fill="#fff" ' + sw + '/>' +
          [-20, -7, 6, 19].map(function (x) { return '<rect x="' + x + '" y="0" width="8" height="18" fill="#fff" ' + sw + '/>'; }).join('') +
          '<rect x="-32" y="18" width="64" height="7" rx="2" fill="' + d + '"/><circle cy="-13" r="3.5" fill="#fff"/>';
      case 'church':
        return '<rect x="-24" y="-4" width="48" height="24" rx="3" fill="#fff" ' + sw + '/><path d="M-27 -4 L0 -24 L27 -4Z" fill="' + c + '" ' + sw + '/>' +
          '<rect x="-6" y="-38" width="12" height="16" fill="#fff" ' + sw + '/><path d="M0 -50 V-40 M-4 -46 H4" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M-6 20 V8 a6 6 0 0 1 12 0 V20Z" fill="' + d + '"/>';
      case 'gate':
        return '<rect x="-28" y="-18" width="56" height="40" rx="3" fill="' + c + '" ' + sw + '/>' +
          [-28, -12, 4, 20].map(function (x) { return '<rect x="' + x + '" y="-27" width="8" height="10" fill="' + c + '" ' + sw + '/>'; }).join('') +
          '<path d="M-11 22 V0 a11 11 0 0 1 22 0 V22Z" fill="' + d + '"/>';
      case 'square':
        return '<ellipse cy="10" rx="30" ry="14" fill="#bfeefb" ' + sw + '/><ellipse cy="8" rx="19" ry="8" fill="#fff" ' + sw + '/>' +
          '<rect x="-4" y="-14" width="8" height="22" fill="' + c + '" ' + sw + '/><path d="M0 -14 Q-16 -22 -20 -6 M0 -14 Q16 -22 20 -6" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>' +
          '<circle cx="-20" cy="-4" r="3" fill="#3cc3f3"/><circle cx="20" cy="-4" r="3" fill="#3cc3f3"/><circle cy="-20" r="4" fill="#3cc3f3"/>';
      case 'park':
        return [[-16, 6, 15], [14, 8, 13], [0, -10, 17]].map(function (t, i) {
          return '<rect x="' + (t[0] - 3) + '" y="' + t[1] + '" width="6" height="16" fill="#8d5a3b"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="' + t[2] + '" fill="' + (i === 2 ? '#79d38a' : c) + '" ' + sw + '/>';
        }).join('');
      case 'palace':
        return '<rect x="-30" y="16" width="60" height="8" rx="2" fill="#fff" ' + sw + '/><rect x="-23" y="8" width="46" height="8" rx="2" fill="#fff" ' + sw + '/><rect x="-16" y="0" width="32" height="8" rx="2" fill="#fff" ' + sw + '/>' +
          '<rect x="-20" y="-22" width="40" height="22" fill="' + c + '" ' + sw + '/><path d="M-24 -22 L0 -38 L24 -22Z" fill="' + d + '"/><rect x="-5" y="-14" width="10" height="14" rx="5" fill="#fff"/>';
      case 'earth':
        var o = '-12,-30 12,-30 30,-12 30,12 12,30 -12,30 -30,12 -30,-12', n = '-8,-20 8,-20 20,-8 20,8 8,20 -8,20 -20,8 -20,-8';
        return '<polygon points="' + o + '" fill="' + c + '" ' + sw + '/><polygon points="' + n + '" fill="#9ed98a" ' + sw + '/><circle r="6" fill="#fff" ' + sw + '/>';
    }
    return '';
  }
  function stampSVG(s, locked, big) {
    var col = locked ? '#b6bdd6' : s.color;
    return '<svg class="' + (big ? 'stampbig' : 'st' + (locked ? ' locked' : '')) + '" viewBox="-44 -44 88 88" aria-hidden="true">' +
      '<circle r="41" fill="#fff" stroke="' + col + '" stroke-width="4" stroke-dasharray="6 4"/><circle r="34" fill="' + (locked ? '#eef0f8' : '#fff7de') + '"/>' +
      '<g transform="scale(.7)">' + icon(s.type, col) + '</g></svg>';
  }

  /* ---------- Map ---------- */
  var map = $('#map');
  var seed = 11;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function segDist(px, py, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / l)) : 0;
    return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
  }
  function nearRoad(x, y) {
    for (var r = 0; r < ROADS.length; r++) for (var i = 0; i < ROADS[r].length - 1; i++) if (segDist(x, y, ROADS[r][i], ROADS[r][i + 1]) < 30) return true;
    return false;
  }
  function nearSpot(x, y, r) { return SPOTS.some(function (s) { return Math.hypot(s.x - x, s.y - y) < r; }); }
  function inEll(x, y, cx, cy, rx, ry) { return Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) < 1; }

  var defs = el('defs', {}, map);
  var grad = el('linearGradient', { id: 'gg', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el('stop', { offset: 0, 'stop-color': '#e9fadb' }, grad); el('stop', { offset: 1, 'stop-color': '#d6f2c6' }, grad);
  el('rect', { width: 1000, height: 680, fill: 'url(#gg)' }, map);

  // fields
  [[130, 110, 150, 70, '#f6efc4'], [760, 560, 170, 70, '#f6efc4'], [300, 600, 130, 50, '#cdeec0'], [940, 120, 90, 60, '#cdeec0']].forEach(function (f) {
    el('ellipse', { cx: f[0], cy: f[1], rx: f[2], ry: f[3], fill: f[4] }, map);
  });
  // parks
  el('ellipse', { cx: 790, cy: 300, rx: 150, ry: 105, fill: '#b9ecA7'.replace('A', 'a') }, map);
  el('ellipse', { cx: 150, cy: 490, rx: 125, ry: 92, fill: '#b9eca7' }, map);
  var pond = el('ellipse', { cx: 850, cy: 255, rx: 36, ry: 20, fill: '#8fdcf7', class: 'shimmer' }, map);
  el('ellipse', { cx: 842, cy: 252, rx: 14, ry: 5, fill: '#fff', opacity: .6 }, map);
  // Cava octagon
  el('polygon', { points: '545,50 575,50 612,87 612,137 575,174 545,174 508,137 508,87', fill: '#cfe9b4', stroke: '#b58f6a', 'stroke-width': 5, 'stroke-dasharray': '10 7' }, map);
  // old town wall
  el('ellipse', { cx: 480, cy: 340, rx: 122, ry: 92, fill: '#fff5df', stroke: '#d6b08a', 'stroke-width': 7, 'stroke-dasharray': '14 8', opacity: .9 }, map);

  // roads
  var roadG = el('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, map);
  ROADS.forEach(function (r) { el('path', { d: 'M' + r.map(function (p) { return p.join(' '); }).join(' L'), stroke: '#f5e5bd', 'stroke-width': 30 }, roadG); });
  ROADS.forEach(function (r) { el('path', { d: 'M' + r.map(function (p) { return p.join(' '); }).join(' L'), stroke: '#ffffff', 'stroke-width': 22 }, roadG); });
  ROADS.forEach(function (r) { el('path', { d: 'M' + r.map(function (p) { return p.join(' '); }).join(' L'), stroke: '#ffd9a8', 'stroke-width': 3, 'stroke-dasharray': '2 14' }, roadG); });

  var rdl = el('text', { x: 350, y: 410, class: 'street', 'text-anchor': 'middle', transform: 'rotate(-22 350 410)' }, map); rdl.textContent = 'Rua Direita';

  // houses
  var roofs = ['#ff5d73', '#ffc93c', '#7a5cff', '#1fbfae', '#ff9f1c', '#3cc3f3'];
  var houseG = el('g', {}, map);
  for (var h = 0, placed = 0; h < 900 && placed < 150; h++) {
    var hx = 30 + rnd() * 940, hy = 40 + rnd() * 600;
    var dTown = Math.hypot((hx - 470) / 1.25, hy - 360);
    if (dTown > 300 || rnd() > 1.15 - dTown / 300) continue;
    if (inEll(hx, hy, 790, 300, 160, 115) || inEll(hx, hy, 150, 490, 135, 102) || inEll(hx, hy, 560, 112, 80, 80) || inEll(hx, hy, 880, 440, 70, 70)) continue;
    if (nearRoad(hx, hy) || nearSpot(hx, hy, 62)) continue;
    var w = 18 + rnd() * 14, ht = 16 + rnd() * 12, rc = roofs[Math.floor(rnd() * roofs.length)];
    el('rect', { x: hx - w / 2, y: hy - ht / 2 + 3, width: w, height: ht, rx: 4, fill: '#fff', stroke: '#e6dcc4', 'stroke-width': 2 }, houseG);
    el('rect', { x: hx - w / 2, y: hy - ht / 2 - 2, width: w, height: ht * .62, rx: 4, fill: rc }, houseG);
    placed++;
  }
  // trees
  var treeG = el('g', {}, map);
  function tree(x, y, sc) {
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + sc + ')' }, treeG);
    var tt = el('g', { class: 'tree', style: 'animation-delay:' + (-rnd() * 4).toFixed(2) + 's' }, g);
    el('rect', { x: -2.5, y: 2, width: 5, height: 10, fill: '#8d5a3b' }, tt);
    el('circle', { cy: -4, r: 12, fill: rnd() > .5 ? '#4cb963' : '#38a853' }, tt);
    el('circle', { cx: -4, cy: -8, r: 4, fill: '#8ee29c', opacity: .8 }, tt);
  }
  for (var t = 0, tp = 0; t < 700 && tp < 70; t++) {
    var tx = 20 + rnd() * 960, ty = 30 + rnd() * 620, inPark = inEll(tx, ty, 790, 300, 140, 95) || inEll(tx, ty, 150, 490, 115, 82);
    if (!inPark && rnd() > .22) continue;
    if (inEll(tx, ty, 850, 255, 44, 28) || nearRoad(tx, ty) || nearSpot(tx, ty, 58) || inEll(tx, ty, 480, 340, 120, 90) || inEll(tx, ty, 880, 440, 62, 62)) continue;
    tree(tx, ty, .8 + rnd() * .5); tp++;
  }
  // flowers in parks
  for (var f = 0; f < 40; f++) {
    var fx = 20 + rnd() * 960, fy = 30 + rnd() * 620;
    if (!(inEll(fx, fy, 790, 300, 140, 95) || inEll(fx, fy, 150, 490, 115, 82)) || nearRoad(fx, fy) || nearSpot(fx, fy, 50) || inEll(fx, fy, 850, 255, 44, 28)) continue;
    el('circle', { cx: fx, cy: fy, r: 3.2, fill: roofs[f % roofs.length] }, map);
  }

  // fair (decorative ferris wheel)
  var fair = el('g', { class: 'fair', transform: 'translate(888 450)' }, map);
  el('path', { d: 'M-26 52 L0 4 L26 52', fill: 'none', stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, fair);
  var wheel = el('g', { class: 'wheel' }, fair);
  el('circle', { r: 46, fill: 'rgba(255,255,255,.5)', stroke: INK, 'stroke-width': 4 }, wheel);
  for (var sp = 0; sp < 8; sp++) {
    var an = sp * Math.PI / 4, cxp = Math.cos(an) * 46, cyp = Math.sin(an) * 46;
    el('line', { x1: 0, y1: 0, x2: cxp, y2: cyp, stroke: INK, 'stroke-width': 2.5 }, wheel);
    el('circle', { cx: cxp, cy: cyp, r: 8, fill: roofs[sp % 6], stroke: INK, 'stroke-width': 2.5 }, wheel);
  }
  el('circle', { r: 6, fill: INK }, fair);
  var fl = el('text', { y: 82, 'text-anchor': 'middle', 'font-size': 14 }, fair); fl.textContent = 'São Mateus fair';

  // collectibles
  var itemG = el('g', {}, map), itemEls = {};
  ITEMS.forEach(function (it) {
    var g = el('g', { transform: 'translate(' + it.x + ' ' + it.y + ')' }, itemG);
    if (it.t === 'coin') {
      var c = el('g', { class: 'coin', style: 'animation-delay:' + (-rnd() * 1.8).toFixed(2) + 's' }, g);
      el('circle', { r: 10, fill: '#ffc93c', stroke: '#e59a00', 'stroke-width': 3 }, c);
      el('rect', { x: -1.8, y: -5, width: 3.6, height: 10, rx: 1.5, fill: '#e59a00' }, c);
    } else {
      g.insertAdjacentHTML('beforeend', '<g class="ibob" style="animation-delay:' + (-rnd() * 2.6).toFixed(2) + 's">' + itemIcon(it.t) + '</g>');
    }
    if (S.got[it.id]) g.setAttribute('display', 'none');
    itemEls[it.id] = g;
  });

  // landmarks
  var spotG = el('g', {}, map), spotEls = {};
  SPOTS.forEach(function (s) {
    var g = el('g', { class: 'spot' + (S.stamps[s.id] ? ' done' : ''), transform: 'translate(' + s.x + ' ' + s.y + ')', 'data-id': s.id }, spotG);
    el('circle', { class: 'halo', r: 50 }, g);
    var b = el('g', { class: 'bob' }, g);
    el('ellipse', { cy: 28, rx: 30, ry: 7, fill: 'rgba(29,42,74,.15)' }, g);
    b.insertAdjacentHTML('beforeend', icon(s.type, s.color));
    var tk = el('g', { class: 'tick', transform: 'translate(30 -30)' }, g);
    el('circle', { r: 13, fill: '#1fbfae', stroke: '#fff', 'stroke-width': 3 }, tk);
    el('path', { d: 'M-6 0 L-2 5 L7 -5', fill: 'none', stroke: '#fff', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, tk);
    var lb = el('text', { y: 52, 'text-anchor': 'middle' }, g); lb.textContent = spotText(s, 'name');
    spotEls[s.id] = g;
  });

  // clouds and birds
  var skyG = el('g', { 'pointer-events': 'none' }, map);
  [[70, 60, 38], [160, 250, 52], [60, 590, 30]].forEach(function (c, i) {
    var cg = el('g', { class: 'cloud', style: 'animation-duration:' + (60 + i * 25) + 's;animation-delay:' + (-i * 22) + 's' }, skyG);
    var tr = el('g', { transform: 'translate(0 ' + c[1] + ') scale(' + (c[2] / 40) + ')' }, cg);
    [[0, 0, 26], [26, -8, 22], [52, 0, 24], [26, 8, 28]].forEach(function (e) { el('ellipse', { cx: e[0], cy: e[1], rx: e[2], ry: e[2] * .62, fill: '#fff', opacity: .85 }, tr); });
  });
  [[0, 90], [-120, 150]].forEach(function (b, i) {
    var bg = el('g', { class: 'bird', style: 'animation-delay:' + (i * -6) + 's;animation-duration:' + (14 + i * 4) + 's' }, skyG);
    var pos = el('g', { transform: 'translate(' + b[0] + ' ' + b[1] + ')' }, bg);
    var fp = el('g', { class: 'flap' }, pos);
    el('path', { d: 'M-12 0 Q-6 -9 0 0 Q6 -9 12 0', fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, fp);
  });

  // effects layer, target ping, player
  var fx = el('g', { 'pointer-events': 'none' }, map);
  var ping = el('circle', { r: 14, fill: 'none', stroke: '#ff5d73', 'stroke-width': 4, class: 'ping', display: 'none' }, map);
  var meG = el('g', { 'pointer-events': 'none' }, map);
  el('circle', { class: 'sonar', r: 26, cy: 6, fill: 'none', stroke: '#1f5fbf', 'stroke-width': 3 }, meG);
  el('ellipse', { cy: 20, rx: 18, ry: 6, fill: 'rgba(29,42,74,.25)' }, meG);
  var hop = el('g', { class: 'idle' }, meG);
  var face = el('g', {}, hop);
  el('rect', { x: -13, y: -2, width: 26, height: 22, rx: 11, fill: '#ff5d73', stroke: INK, 'stroke-width': 3 }, face);
  el('circle', { cy: -12, r: 15, fill: '#ffd9b0', stroke: INK, 'stroke-width': 3 }, face);
  var hatA = el('path', { d: 'M-17 -15 Q0 -38 17 -15 Z', fill: '#ffc93c', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, face);
  var hatB = el('rect', { x: -21, y: -16, width: 42, height: 6, rx: 3, fill: '#ffc93c', stroke: INK, 'stroke-width': 3 }, face);
  el('circle', { cx: 5, cy: -9, r: 2.4, fill: INK }, face); el('circle', { cx: 12, cy: -9, r: 2.4, fill: INK }, face);
  el('path', { d: 'M5 -3 Q8.5 0 12 -3', fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-linecap': 'round' }, face);
  el('rect', { x: -17, y: 2, width: 9, height: 14, rx: 4, fill: '#7a5cff', stroke: INK, 'stroke-width': 2.5 }, face);

  /* ---------- Player and loop ---------- */
  var me = { x: 285, y: 480 }, target = null, heading = 1, nearId = null, modalOpen = false, keys = {};
  var SPEED = 230;
  var VB = { x: 0, y: 0, w: 1000, h: 680 }, vbAnim = 0;
  function setVB() { map.setAttribute('viewBox', VB.x.toFixed(1) + ' ' + VB.y.toFixed(1) + ' ' + VB.w.toFixed(1) + ' ' + VB.h.toFixed(1)); }
  function zoomPulse(s) {
    if (RM || !s) return;
    cancelAnimationFrame(vbAnim);
    var t0 = performance.now(), dur = 1800;
    function step(now) {
      var p = Math.min(1, (now - t0) / dur), k = Math.sin(Math.PI * p), z = 1 - 0.2 * k;
      VB.w = 1000 * z; VB.h = 680 * z;
      VB.x = Math.max(0, Math.min(1000 - VB.w, 500 + (s.x - 500) * k * 0.7 - VB.w / 2));
      VB.y = Math.max(0, Math.min(680 - VB.h, 340 + (s.y - 340) * k * 0.7 - VB.h / 2));
      setVB();
      if (p < 1) vbAnim = requestAnimationFrame(step); else { VB = { x: 0, y: 0, w: 1000, h: 680 }; setVB(); }
    }
    vbAnim = requestAnimationFrame(step);
  }
  var lastComp = '';
  function updateCompass() {
    var n = nextStop(), txt = 'All found', ang = 0;
    if (n) { ang = Math.atan2(n.s.y - me.y, n.s.x - me.x) * 180 / Math.PI + 90; txt = n.d < 78 ? 'Here!' : Math.round(n.d / 9) + ' steps'; }
    var key = txt + '|' + Math.round(ang / 4);
    if (key === lastComp) return; lastComp = key;
    $('#needle').style.transform = 'rotate(' + ang.toFixed(0) + 'deg)'; $('#compTxt').textContent = txt;
  }
  function place() { meG.setAttribute('transform', 'translate(' + me.x.toFixed(1) + ' ' + me.y.toFixed(1) + ')'); face.setAttribute('transform', 'scale(' + heading + ' 1)'); }
  place();

  function svgPoint(ev) {
    var pt = map.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    var m = map.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : { x: me.x, y: me.y };
  }
  function walkTo(x, y) {
    target = { x: Math.max(24, Math.min(976, x)), y: Math.max(40, Math.min(650, y)) };
    ping.setAttribute('cx', target.x); ping.setAttribute('cy', target.y); ping.setAttribute('display', 'inline');
    blip([420], .06);
  }
  var mapFrame = $('.mapframe'), mapFullscreen = false, cityMapMode = true, screenOpen = false, activeScreen = null;
  var cityMapModule = null, cityMapLoading = null;
  var bodyOverflowBeforeOverlay = '';
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.bottom-nav-item'));
  var screenPanels = Array.prototype.slice.call(document.querySelectorAll('[data-screen-panel]'));
  function setNavActive(name) {
    navItems.forEach(function (item) {
      var active = item.getAttribute('data-nav') === name;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }
  function showScreen(name) {
    var panel = document.querySelector('[data-screen-panel="' + name + '"]');
    if (!panel) return;
    if (activeScreen) closeScreen();
    activeScreen = panel;
    screenOpen = true;
    bodyOverflowBeforeOverlay = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.hidden = false;
    setNavActive(name);
    if (name === 'profile') renderProfile();
    if (name === 'trails') { renderDaily(); renderTrails(); }
    window.dispatchEvent(new CustomEvent('viseu:screenchange', { detail: { open: true } }));
    var closeButton = panel.querySelector('[data-close-screen]');
    if (closeButton) closeButton.focus();
  }
  function closeScreen() {
    if (!activeScreen) return;
    var panel = activeScreen;
    activeScreen = null;
    screenOpen = false;
    panel.hidden = true;
    document.body.style.overflow = bodyOverflowBeforeOverlay;
    setNavActive('map');
    window.dispatchEvent(new CustomEvent('viseu:screenchange', { detail: { open: false } }));
    var navMap = $('#navMap');
    if (navMap) navMap.focus();
  }
  function setCityMapMode(useCityMap) {
    cityMapMode = useCityMap;
    mapFrame.classList.toggle('is-game-map', !useCityMap);
    map.hidden = useCityMap;
    $('#cityMap').hidden = !useCityMap;
    $('#mapModeToggle').textContent = useCityMap ? t('map.switch.game') : t('map.switch.street');
    if (!cityMapModule) return;
    if (useCityMap) {
      cityMapModule.setCityItemsClaimed(CITY_MAP_ITEMS.filter(function (item) {
        return S.got[item.id];
      }).map(function (item) { return item.id; }));
      cityMapModule.showCityMap();
    } else cityMapModule.hideCityMap();
  }
  function setMapFullscreen(open) {
    mapFullscreen = open;
    mapFrame.classList.toggle('is-fullscreen', open);
    if (open) {
      cityMapMode = true;
      mapFrame.classList.remove('is-game-map');
      $('#mapModeToggle').hidden = false;
      $('#mapModeToggle').disabled = true;
      $('#cityMap').hidden = true;
      map.hidden = false;
      cityMapLoading = cityMapLoading || import('./city-map.js');
      cityMapLoading.then(function (module) {
        cityMapModule = module;
        if (!mapFullscreen) return;
        window.dispatchEvent(new CustomEvent('viseu:location-preference', {
          detail: {
            enabled: S.profile.shareLocation,
            approximate: S.profile.approximateLocation
          }
        }));
        $('#mapModeToggle').disabled = false;
        setCityMapMode(true);
      }).catch(function (error) {
        if (!mapFullscreen) return;
        console.error('Unable to load the city map.', error);
        setCityMapMode(false);
        $('#mapModeToggle').disabled = true;
        $('#mapModeToggle').textContent = t('map.unavailable');
        $('#mapHint').textContent = t('map.loaderror');
      });
    } else {
      cityMapMode = false;
      mapFrame.classList.remove('is-game-map');
      map.hidden = false;
      if (cityMapModule) cityMapModule.hideCityMap();
      else $('#cityMap').hidden = true;
      $('#mapModeToggle').hidden = true;
    }
    $('#mapFullscreenClose').hidden = !open;
    $('#mapHint').textContent = open
      ? t('map.fullscreen.hint')
      : t('map.hint');
    if (open) {
      bodyOverflowBeforeOverlay = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setNavActive('map');
      $('#mapFullscreenClose').focus();
    } else {
      document.body.style.overflow = bodyOverflowBeforeOverlay;
      map.focus({ preventScroll: true });
    }
  }
  $('#mapModeToggle').addEventListener('click', function () {
    if (mapFullscreen && cityMapModule) setCityMapMode(!cityMapMode);
  });
  window.addEventListener('viseu:city-item-claim', function (event) {
    var id = event.detail && event.detail.id;
    var item = CITY_MAP_ITEMS.filter(function (candidate) { return candidate.id === id; })[0];
    if (!item || S.got[item.id]) return;
    rollDaily();
    S.got[item.id] = 1;
    S.coins += item.v;
    S.items[item.t] = (S.items[item.t] || 0) + 1;
    S.daily.stats.pickups += 1;
    addXp(item.xp);
    save();
    renderHud();
    renderItems();
    renderDaily();
    renderTrails();
    if (cityMapModule) {
      cityMapModule.setCityItemsClaimed(CITY_MAP_ITEMS.filter(function (candidate) { return S.got[candidate.id]; }).map(function (candidate) { return candidate.id; }));
    }
    var itemSpot = SPOTS.filter(function (candidate) { return candidate.id === item.spotId; })[0];
    $('#live').textContent = tr('live.discovered', { name: itemSpot ? spotText(itemSpot, 'name') : item.name, coins: item.v, xp: item.xp });
    blip([660, 880, 1100], .07);
  });
  window.addEventListener('viseu:city-item-explore', function (event) {
    var spotId = event.detail && event.detail.spotId;
    var spot = SPOTS.filter(function (candidate) { return candidate.id === spotId; })[0];
    if (!mapFullscreen || !spot) return;
    setCityMapMode(false);
    walkTo(spot.x, spot.y + 44);
    $('#live').textContent = tr('live.exploring', { name: spotText(spot, 'name') });
  });
  navItems.forEach(function (item) {
    if (item.getAttribute('data-nav') === 'studio') return;
    item.addEventListener('click', function () {
      var name = item.getAttribute('data-nav');
      if (name === 'map') {
        closeScreen();
        setNavActive('map');
        return;
      }
      showScreen(name);
    });
  });
  screenPanels.forEach(function (panel) {
    panel.addEventListener('click', function (ev) {
      if (ev.target === panel || ev.target.closest('[data-close-screen]')) closeScreen();
    });
    panel.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { closeScreen(); return; }
      if (ev.key !== 'Tab') return;
      var focusable = Array.prototype.slice.call(panel.querySelectorAll('button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'))
        .filter(function (node) { return node.getClientRects().length > 0; });
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    });
  });
  $('#profileName').addEventListener('input', function (ev) {
    S.profile.name = ev.target.value.slice(0, 24);
    var name = S.profile.name.trim() || t('level.' + Math.min(level(), TITLES.length));
    $('#profileLevel').textContent = name + ' · ' + (locale === 'pt' ? 'Nível ' : 'Level ') + level();
    save();
  });
  $('#profileAvatarChoice').addEventListener('change', function (ev) {
    S.profile.avatar = ev.target.value;
    $('#profileAvatar').textContent = S.profile.avatar;
    save();
  });
  [['#shareLocation', 'shareLocation'], ['#approxLocation', 'approximateLocation'], ['#locationAudience', 'audience']].forEach(function (setting) {
    $(setting[0]).addEventListener('change', function (ev) {
      S.profile[setting[1]] = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
      save();
      window.dispatchEvent(new CustomEvent('viseu:location-preference', {
        detail: {
          enabled: S.profile.shareLocation,
          approximate: S.profile.approximateLocation
        }
      }));
    });
  });
  window.dispatchEvent(new CustomEvent('viseu:location-preference', {
    detail: {
      enabled: S.profile.shareLocation,
      approximate: S.profile.approximateLocation
    }
  }));
  $('#healthInfo').addEventListener('click', function () {
    $('#healthInfo').textContent = t('health.unavailable');
  });
  $('#dailyCheckin').addEventListener('click', claimCheckin);
  $('#dailyChallenges').addEventListener('click', function (ev) {
    var button = ev.target.closest('[data-daily-claim]');
    if (button) claimDailyChallenge(button.getAttribute('data-daily-claim'));
  });
  $('#trailList').addEventListener('click', function (ev) {
    var button = ev.target.closest('[data-trail-claim]');
    if (button) claimTrail(button.getAttribute('data-trail-claim'));
  });
  $('#mapFullscreenClose').addEventListener('click', function () { setMapFullscreen(false); });
  window.addEventListener('viseu:screenchange', function (ev) {
    screenOpen = Boolean(ev.detail && ev.detail.open);
    syncGameLoop();
  });
  map.addEventListener('pointerdown', function (ev) {
    if (modalOpen || screenOpen) return;
    if (!mapFullscreen) { setMapFullscreen(true); return; }
    var p = svgPoint(ev), best = null, bd = 48;
    SPOTS.forEach(function (s) { var d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } });
    if (best) walkTo(best.x, best.y + 44); else walkTo(p.x, p.y);
  });
  var KEYMAP = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ArrowUp: 'u', w: 'u', W: 'u', ArrowDown: 'd', s: 'd', S: 'd' };
  window.addEventListener('keydown', function (e) {
    if (modalOpen) { if (e.key === 'Escape') closeModal(); return; }
    if (e.key === 'Escape' && mapFullscreen) { setMapFullscreen(false); return; }
    if (screenOpen) return;
    var k = KEYMAP[e.key]; if (!k) return;
    if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    keys[k] = true; e.preventDefault();
  });
  window.addEventListener('keyup', function (e) { var k = KEYMAP[e.key]; if (k) keys[k] = false; });
  window.addEventListener('blur', function () { keys = {}; });

  var last = 0, frameRequest = 0;
  function frame(t) {
    frameRequest = 0;
    if (modalOpen || screenOpen || document.hidden) return;
    frameRequest = requestAnimationFrame(frame);
    var dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    var vx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), vy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0), moving = false;
    if (vx || vy) {
      var l = Math.hypot(vx, vy); target = null; ping.setAttribute('display', 'none');
      me.x += vx / l * SPEED * dt; me.y += vy / l * SPEED * dt; if (vx) heading = vx > 0 ? 1 : -1; moving = true;
    } else if (target) {
      var dx = target.x - me.x, dy = target.y - me.y, d = Math.hypot(dx, dy);
      if (d < 3) { target = null; ping.setAttribute('display', 'none'); }
      else { var st = Math.min(d, SPEED * dt); me.x += dx / d * st; me.y += dy / d * st; if (Math.abs(dx) > 2) heading = dx > 0 ? 1 : -1; moving = true; }
    }
    me.x = Math.max(20, Math.min(980, me.x)); me.y = Math.max(40, Math.min(650, me.y));
    hop.setAttribute('class', moving ? 'walk' : 'idle');
    place();
    updateCompass();
    // landmark proximity
    var nid = null, nd = 78;
    SPOTS.forEach(function (s) { var d = Math.hypot(s.x - me.x, s.y - me.y); if (d < nd) { nd = d; nid = s.id; } });
    if (nid !== nearId) {
      if (nearId) spotEls[nearId].classList.remove('near');
      nearId = nid; if (nid) { spotEls[nid].classList.add('near'); blip([660, 880], .08); zoomPulse(SPOTS.filter(function (q) { return q.id === nid; })[0]); }
      renderDock();
    }
    // collectibles
    ITEMS.forEach(function (it) {
      if (S.got[it.id]) return;
      if (Math.hypot(it.x - me.x, it.y - me.y) < 26) collect(it);
    });
  }
  function syncGameLoop() {
    if (modalOpen || screenOpen || document.hidden) {
      if (frameRequest) cancelAnimationFrame(frameRequest);
      frameRequest = 0;
      last = 0;
      keys = {};
      return;
    }
    if (!frameRequest) frameRequest = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', syncGameLoop);
  syncGameLoop();

  function collect(it) {
    rollDaily();
    var v = it.t === 'dice' ? 2 + Math.floor(Math.random() * 11) : it.v;
    S.got[it.id] = 1; S.coins += v; S.items[it.t] = (S.items[it.t] || 0) + 1;
    S.daily.stats.pickups += 1; save();
    itemEls[it.id].setAttribute('display', 'none');
    popText(it.x, it.y, '+' + v, it.t === 'coin' ? '#e59a00' : '#7a5cff');
    burst(it.x, it.y, it.t === 'coin' ? '#ffc93c' : '#7a5cff');
    blip(it.t === 'coin' ? [880, 1320] : [660, 880, 1100], .07);
    $('#live').textContent = tr('live.found', { name: tKey('item.' + it.t, TYPES[it.t]), coins: v });
    renderHud(); renderItems();
  }
  function popText(x, y, txt, col) {
    var t = el('text', { x: x, y: y - 10, 'text-anchor': 'middle', class: 'float', fill: col, 'font-size': 26, 'font-weight': 700, style: 'font-family:var(--font-display);paint-order:stroke;stroke:#fff;stroke-width:5px' }, fx);
    t.textContent = txt; setTimeout(function () { t.remove(); }, 1000);
  }
  function burst(x, y, col) {
    var c = el('circle', { cx: x, cy: y, r: 14, fill: 'none', stroke: col, 'stroke-width': 4, class: 'burst' }, fx);
    setTimeout(function () { c.remove(); }, 650);
  }

  /* ---------- HUD, dock, passport ---------- */
  function renderHud() {
    var lv = level();
    $('#lvlName').textContent = (locale === 'pt' ? 'Nv ' : 'Lv ') + lv + ' ' + t('level.' + Math.min(lv, TITLES.length));
    $('#xpFill').style.width = (S.xp % 100) + '%';
    $('#coinN').textContent = S.coins;
    $('#stampN').textContent = stampCount() + '/8';
    $('#ppCount').textContent = tr('count.stamps', { count: stampCount() });
    var sb = $('#snd'); sb.setAttribute('aria-pressed', S.mute ? 'false' : 'true'); sb.setAttribute('aria-label', t(S.mute ? 'sound.off' : 'sound.on'));
    $('#sndWave').style.display = S.mute ? 'none' : '';
  }
  function nextStop() {
    var best = null, bd = 1e9;
    SPOTS.forEach(function (s) { if (S.stamps[s.id]) return; var d = Math.hypot(s.x - me.x, s.y - me.y); if (d < bd) { bd = d; best = s; } });
    return best ? { s: best, d: bd } : null;
  }
  function renderDock() {
    var d = $('#dock'), s = nearId && SPOTS.filter(function (x) { return x.id === nearId; })[0], h;
    if (s) {
      var got = S.stamps[s.id];
      h = '<svg class="ico" viewBox="-44 -44 88 88" aria-hidden="true"><g transform="scale(1.2)">' + icon(s.type, s.color) + '</g></svg>' +
        '<div class="txt"><h2>' + tr(got ? 'dock.welcome' : 'dock.at', { name: spotText(s, 'name') }) + '</h2><p>' + (got ? (S.quiz[s.id] ? t('dock.stamp.quiz') : t('dock.stamp.pending')) : t('dock.checkin')) + '</p></div>' +
        '<button class="btn' + (got ? ' alt' : ' pulse') + '" type="button" data-act="open" data-id="' + s.id + '">' + (got ? t('dock.open') : t('dock.checkin.button')) + '</button>';
    } else if (stampCount() === 8) {
      h = '<svg class="ico" viewBox="-12 -12 24 24" aria-hidden="true"><path d="M0 -10 L3 -3.2 10 -2.6 4.8 2 6.2 9 0 5.5 -6.2 9 -4.8 2 -10 -2.6 -3 -3.2Z" fill="#ffc93c" stroke="#1d2a4a" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
        '<div class="txt"><h2>' + t('dock.legend') + '</h2><p>' + t('dock.allstamps') + '</p></div>';
    } else {
      var n = nextStop();
      h = '<svg class="ico" viewBox="-44 -44 88 88" aria-hidden="true"><g transform="scale(1.2)">' + icon(n.s.type, n.s.color) + '</g></svg>' +
        '<div class="txt"><h2>' + tr('dock.next', { name: spotText(n.s, 'name') }) + '</h2><p>' + tr('dock.steps', { count: Math.max(1, Math.round(n.d / 9)) }) + '</p></div>' +
        '<button class="btn go" type="button" data-act="go" data-id="' + n.s.id + '">' + t('dock.walk') + '</button>';
    }
    d.innerHTML = h;
  }
  function renderGrid() {
    $('#grid').innerHTML = SPOTS.map(function (s) {
      var got = S.stamps[s.id];
      return '<div class="card' + (got ? ' got' : '') + '">' + stampSVG(s, !got, false) + '<div><h3>' + spotText(s, 'name') + '</h3><p>' + (got ? (S.quiz[s.id] ? t('stamp.quiz.done') : t('stamp.done')) : t('stamp.notvisited')) + '</p>' +
        (got ? '' : '<button class="btn go" type="button" data-act="go" data-id="' + s.id + '">' + t('dock.walk') + '</button>') + '</div></div>';
    }).join('');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'buy' || act === 'equip') { skinAct(act, b.getAttribute('data-id')); return; }
    var s = SPOTS.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0]; if (!s) return;
    if (b.getAttribute('data-act') === 'go') {
      if (activeScreen) closeScreen();
      walkTo(s.x, s.y + 44);
      window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    }
    else if (b.getAttribute('data-act') === 'open') openSpot(s);
  });

  /* ---------- Modal ---------- */
  var modal = $('#modal'), mBody = $('#mBody'), pendingCelebrate = [];
  function flushPendingCelebrate() {
    while (pendingCelebrate.length) celebrate(pendingCelebrate.shift());
  }
  function openModal() { modalOpen = true; modal.hidden = false; keys = {}; syncGameLoop(); setTimeout(function () { var f = modal.querySelector('.btn, .opt'); if (f) f.focus(); }, 30); }
  function closeModal() {
    modal.hidden = true; modalOpen = false; renderDock(); renderGrid(); renderHud(); renderItems();
    renderDaily(); renderTrails();
    syncGameLoop();
    flushPendingCelebrate();
    map.focus({ preventScroll: true });
  }
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('pointerdown', function (e) { if (e.target === modal) closeModal(); });

  var quickTourIndex = 0;
  var QUICK_TOUR_STEPS = {
    en: [
      { icon: '🗺️', label: 'Map', title: 'Map', detail: 'The map is your city guide. Tap a landmark, walk to it, and unlock that area’s stamp and quick quiz.' },
      { icon: '👤', label: 'Profile', title: 'Profile', detail: 'Your profile holds your explorer name, badge, and map privacy settings. Turn on location only when you want it shown on the city map.' },
      { icon: '🧭', label: 'Trails', title: 'Trails', detail: 'Trails turn your adventure into challenges: stamps, quizzes, collectible finds, and longer streaks build your progress.' },
      { icon: '📘', label: 'Passport', title: 'Passport', detail: 'The passport keeps a running record of every landmark you collect so you can see which stops are done and still open.' },
      { icon: '🧺', label: 'Collection', title: 'Collection', detail: 'Collections track rewards, borrowed items, discovery coins, and memorabilia from the places you visit around Viseu.' },
      { icon: '🧢', label: 'Avatar', title: 'Avatar', detail: 'Spend coins in the avatar shop to change your explorer look and dress up your in-game identity.' },
      { icon: '🎨', label: 'Studio', title: 'Studio', detail: 'The Studio shop is where you browse new art, founder perks, and special digital products built for the Viseu world.' }
    ],
    pt: [
      { icon: '🗺️', label: 'Mapa', title: 'Mapa', detail: 'O mapa é o teu guia da cidade. Toca num ponto de interesse, desloca-te até lá e desbloqueia a marca e o quiz rápido dessa zona.' },
      { icon: '👤', label: 'Perfil', title: 'Perfil', detail: 'O perfil guarda o teu nome de explorador, o emblema e as definições de privacidade do mapa. Liga a localização só quando quiseres mostrá-la no mapa da cidade.' },
      { icon: '🧭', label: 'Rotas', title: 'Rotas', detail: 'As rotas transformam a aventura em desafios: selos, quizzes, descobertas e desafios mais longos ajudam o teu progresso.' },
      { icon: '📘', label: 'Passaporte', title: 'Passaporte', detail: 'O passaporte guarda o registo de cada monumento que recolhes para veres quais os locais concluídos e os que ainda faltam.' },
      { icon: '🧺', label: 'Coleção', title: 'Coleção', detail: 'A coleção acompanha recompensas, itens, moedas de descoberta e lembranças dos lugares que visitas em Viseu.' },
      { icon: '🧢', label: 'Avatar', title: 'Avatar', detail: 'Gasta moedas na loja do avatar para mudar a aparência do teu explorador e personalizar a identidade do jogo.' },
      { icon: '🎨', label: 'Studio', title: 'Studio', detail: 'A loja Studio é onde exploras arte nova, vantagens de fundador e produtos digitais especiais criados para o mundo de Viseu.' }
    ]
  };
  function renderQuickTour(index) {
    quickTourIndex = index;
    var steps = QUICK_TOUR_STEPS[locale] || QUICK_TOUR_STEPS.en;
    var step = steps[index];
    var isLast = index === steps.length - 1;
    mBody.innerHTML = '<div class="quick-tour-wrap">' +
      '<div class="quick-tour-stepper">' + steps.map(function (item, i) {
        var state = i === index ? 'is-active' : i < index ? 'is-done' : '';
        return '<button type="button" class="tour-step ' + state + '" data-tour-index="' + i + '" aria-label="' + tr('tour.goto', { label: item.label }) + '">' + item.icon + '</button>';
      }).join('') + '</div>' +
      '<div class="quick-tour-display">' +
        '<div class="quick-tour-icon" aria-hidden="true">' + step.icon + '</div>' +
      '</div>' +
      '<div class="quick-tour-eyebrow">' + t('tour.step.' + ['map', 'profile', 'trails', 'passport', 'collection', 'avatar', 'studio'][index]) + ' · ' + (index + 1) + '/' + steps.length + '</div>' +
      '<h2 id="mTitle" class="quick-tour-title">' + step.title + '</h2>' +
      '<p class="quick-tour-copy">' + step.detail + '</p>' +
      '<div class="quick-tour-dictionary">' + steps.map(function (item) {
        return '<div class="quick-tour-dictionary-item"><span>' + item.icon + '</span>' + item.label + '</div>';
      }).join('') + '</div>' +
      '<div class="quick-tour-actions"><button class="btn ghost" type="button" data-tour-action="prev" ' + (index === 0 ? 'disabled' : '') + '>' + t('tour.back') + '</button>' +
      '<button class="btn go" type="button" data-tour-action="next">' + (isLast ? t('tour.finish') : t('tour.next')) + '</button></div>' +
    '</div>';
    var focus = mBody.querySelector('.btn.go') || mBody.querySelector('.btn'); if (focus) focus.focus();
  }
  function openQuickTour() {
    modalOpen = true; modal.hidden = false; quickTourIndex = 0; renderQuickTour(0); keys = {}; syncGameLoop();
  }
  document.addEventListener('click', function (e) {
    var accountButton = e.target.closest && e.target.closest('.auth-button');
    if (accountButton) {
      window.dispatchEvent(new CustomEvent('viseu:open-studio-auth'));
      return;
    }
    var quickButton = e.target.closest && e.target.closest('.quick-tour-trigger');
    if (quickButton) {
      openQuickTour();
      return;
    }
    var langButton = e.target.closest && e.target.closest('.lang-btn');
    if (langButton) {
      setLocale(langButton.getAttribute('data-lang'));
      return;
    }
    var tourJumper = e.target.closest && e.target.closest('[data-tour-index]');
    if (tourJumper) {
      renderQuickTour(Number(tourJumper.getAttribute('data-tour-index')));
      return;
    }
    var tourAction = e.target.closest && e.target.closest('[data-tour-action]');
    if (tourAction) {
      var action = tourAction.getAttribute('data-tour-action');
      if (action === 'prev') {
        renderQuickTour(Math.max(0, quickTourIndex - 1));
      } else if (action === 'next') {
        if (quickTourIndex >= (QUICK_TOUR_STEPS[locale] || QUICK_TOUR_STEPS.en).length - 1) {
          closeModal();
        } else {
          renderQuickTour(quickTourIndex + 1);
        }
      }
      return;
    }
  });

  function addXp(n) {
    var before = level(); S.xp += n;
    if (level() > before)     pendingCelebrate.push(tr('reward.level', {
      level: level(),
      title: t('level.' + Math.min(level(), TITLES.length))
    }));
  }
  function openSpot(s) {
    var first = !S.stamps[s.id];
    if (first) {
      rollDaily();
      S.stamps[s.id] = 1; S.daily.stats.stamps += 1; S.coins += 10; addXp(40);
      S.items[PRIZE[s.id]] = (S.items[PRIZE[s.id]] || 0) + 1;
      spotEls[s.id].classList.add('done');
      var n = stampCount();
      [4, 8].forEach(function (k) { if (n >= k && !S.chests[k]) { S.chests[k] = 1; S.coins += 100; pendingCelebrate.push(k === 8 ? tr('stamp.all') + ' ' + t('reward.legend') : t('reward.chest')); } });
      save();
    }
    if (first) stage0(s); else stage1(s, false);
    openModal();
  }
  function stage1(s, first) {
    var qd = S.quiz[s.id];
    mBody.innerHTML = '<div class="' + (first ? 'flipin' : '') + '">' + stampSVG(s, false, true) + '<h2 id="mTitle">' + spotText(s, 'name') + '</h2><p class="fact">' + spotText(s, 'fact') + '</p>' +
      (first ? '<div class="rewards"><span class="rw">+40 XP</span><span class="rw">+10 ' + t('reward.coins') + '</span><span class="rw b">' + t('reward.stamp') + '</span>' + prizeChip(s) + '</div>' : '') +
      '<div class="actions">' + (qd ? '' : '<button class="btn" type="button" id="goQuiz">' + t('action.quiz') + '</button>') + '<button class="btn ghost" type="button" id="mDone">' + (qd ? t('action.close') : t('action.later')) + '</button></div></div>';
    var gq = $('#goQuiz'); if (gq) gq.onclick = function () { stage2(s); };
    $('#mDone').onclick = closeModal; var f = mBody.querySelector('.btn'); if (f) f.focus();
  }
  function prizeChip(s) {
    var t = PRIZE[s.id];
    return '<span class="rw c"><svg width="20" height="20" viewBox="-16 -16 32 32" style="vertical-align:-5px" aria-hidden="true">' + itemIcon(t) + '</svg> ' + tKey('item.' + t, TYPES[t]) + '</span>';
  }
  function crateSVG() {
    return '<svg viewBox="-60 -60 120 120" width="150" height="150" aria-hidden="true"><rect x="-46" y="-46" width="92" height="92" rx="14" fill="#fff" stroke="#1f5fbf" stroke-width="5"/>' +
      [[-23, -23], [23, -23], [-23, 23], [23, 23]].map(function (p) { return '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 -17 L17 0 L0 17 L-17 0Z" fill="#1f5fbf"/><path d="M0 -8 L8 0 L0 8 L-8 0Z" fill="#fff"/><circle r="2.5" fill="#e2703a"/></g>'; }).join('') +
      '<path d="M-46 0 H46 M0 -46 V46" stroke="#e2703a" stroke-width="6"/><circle r="10" fill="#ffc93c" stroke="#1d2a4a" stroke-width="3"/></svg>';
  }
  function stage0(s) {
    mBody.innerHTML = '<h2 id="mTitle">' + t('crate.title') + '</h2><p class="fact">' + tr('crate.reveal', { name: spotText(s, 'name') }) + '</p><div class="cratewrap"><button class="crate" type="button" id="crate" aria-label="' + t('crate.open') + '">' + crateSVG() + '</button></div>';
    var c = $('#crate'); c.focus();
    c.onclick = function () {
      c.disabled = true; c.classList.add('opening'); blip([523, 659, 784, 1046], .1);
      if (!RM) mBody.insertAdjacentHTML('beforeend', '<div class="raywrap" aria-hidden="true"><div class="rays"></div></div>');
      setTimeout(function () { if (!c.isConnected) return; stage1(s, true); confetti(60); }, RM ? 0 : 800);
    };
  }
  function stage2(s) {
    mBody.innerHTML = '<h2 id="mTitle">' + t('quiz.title') + '</h2><p class="fact" style="color:var(--ink);font-size:18px">' + spotText(s, 'q') + '</p><div class="opts">' +
      spotText(s, 'o').map(function (o, i) { return '<button class="opt" type="button" data-i="' + i + '">' + o + '</button>'; }).join('') + '</div><div class="fb" id="fb" aria-live="polite"></div><div class="actions" id="qa"></div>';
    var done = false;
    mBody.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        if (done) return; done = true;
        var i = +b.getAttribute('data-i'), ok = i === s.a;
        mBody.querySelectorAll('.opt').forEach(function (x, j) { x.disabled = true; if (j === s.a) x.classList.add('right'); });
        rollDaily();
        if (!S.quiz[s.id]) S.daily.stats.quizzes += 1;
        if (ok) { b.classList.add('right'); S.coins += 20; addXp(20); S.quiz[s.id] = 1; $('#fb').textContent = t('quiz.feedback.correct'); blip([784, 988, 1318], .09); confetti(50); }
        else { b.classList.add('wrong'); S.quiz[s.id] = 1; $('#fb').textContent = t('quiz.feedback.incorrect'); blip([300, 220], .12); }
        save(); renderHud();
        $('#qa').innerHTML = '<button class="btn" type="button" id="qDone">' + t('quiz.keep') + '</button>'; $('#qDone').onclick = closeModal; $('#qDone').focus();
      };
    });
    var f = mBody.querySelector('.opt'); if (f) f.focus();
  }

  /* ---------- Banner and confetti ---------- */
  var bn = $('#banner'), bt = 0;
  function celebrate(msg) {
    bn.textContent = msg; bn.classList.add('show'); $('#live').textContent = msg;
    clearTimeout(bt); bt = setTimeout(function () { bn.classList.remove('show'); }, 3200);
    confetti(150); blip([523, 659, 784, 1046, 1318], .11);
  }
  var cv = $('#confetti'), cx = cv.getContext('2d'), parts = [], running = false, COLS = ['#ff5d73', '#ffc93c', '#1fbfae', '#7a5cff', '#3cc3f3', '#ff9f1c'];
  function sizeCv() { var r = window.devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); }
  function confetti(n) {
    if (RM) return; sizeCv();
    for (var i = 0; i < n; i++) parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .4, vx: (Math.random() - .5) * 15, vy: -Math.random() * 13 - 4, r: 4 + Math.random() * 6, c: COLS[i % COLS.length], a: Math.random() * 6, va: (Math.random() - .5) * .4, life: 0 });
    if (!running) { running = true; requestAnimationFrame(cf); }
  }
  function cf() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.y < innerHeight + 20 && p.life < 200; });
    parts.forEach(function (p) {
      p.vy += .4; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore();
    });
    if (parts.length) requestAnimationFrame(cf); else { running = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------- Controls ---------- */
  $('#snd').addEventListener('click', function () { S.mute = !S.mute; save(); renderHud(); if (!S.mute) blip([660, 880], .08); });
  var rs = $('#reset'), rt = 0;
  rs.addEventListener('click', function () {
    if (rs.getAttribute('data-arm')) {
      S = fresh(); save(); location.reload(); return;
    }
    rs.setAttribute('data-arm', '1'); rs.textContent = t('action.startover.confirm');
    clearTimeout(rt); rt = setTimeout(function () { rs.removeAttribute('data-arm'); rs.textContent = t('home.reset'); }, 4000);
  });

  var SKINS = [
    { id: 'cap', name: 'Sunny cap', price: 0, hat: '#ffc93c' },
    { id: 'viriato', name: 'Viriato helm', price: 60, hat: '#cd7f32' },
    { id: 'dao', name: 'Dão wine', price: 90, hat: '#8e2a5c' },
    { id: 'azulejo', name: 'Azulejo blue', price: 120, hat: '#1f5fbf' }
  ];
  function skinById(id) { return SKINS.filter(function (k) { return k.id === id; })[0] || SKINS[0]; }
  function applySkin() { var k = skinById(S.skin); hatA.setAttribute('fill', k.hat); hatB.setAttribute('fill', k.hat); }
  function renderItems() {
    var order = ['coin', 'grape', 'chestnut', 'tile', 'flower', 'shield', 'dice', 'compass', 'token'];
    $('#colCount').textContent = tr('collection.picked', { found: Object.keys(S.got).length, total: ITEMS.length + CITY_MAP_ITEMS.length });
    $('#items').innerHTML = order.map(function (itemType) {
      var n = S.items[itemType] || 0;
      return '<div class="card' + (n ? ' got' : '') + '"><svg class="st' + (n ? '' : ' locked') + '" viewBox="-16 -16 32 32" aria-hidden="true">' + itemIcon(itemType) + '</svg><div><h3>' + tKey('item.' + itemType, TYPES[itemType]) + '</h3><p>' + (n ? '× ' + n : t('collection.notfound')) + '</p></div></div>';
    }).join('');
    var discovered = CITY_MAP_ITEMS.filter(function (item) { return S.got[item.id]; }).length;
    $('#cityDiscoveryCount').textContent = tr('collection.discovered', { found: discovered, total: CITY_MAP_ITEMS.length });
    $('#cityDiscoveryList').innerHTML = CITY_MAP_ITEMS.map(function (item) {
      var found = Boolean(S.got[item.id]);
      return '<div class="city-discovery-card' + (found ? ' is-found' : '') + '"><span class="city-discovery-icon" aria-hidden="true">' + (found ? '✓' : '✦') + '</span>' +
        '<span class="city-discovery-name">' + spotText(SPOTS.filter(function (spot) { return spot.id === item.spotId; })[0] || { id: '', name: item.name }, 'name') + '</span><span class="city-discovery-status">' + (found ? t('map.item.discovered') : t('map.item.notfound')) + '</span></div>';
    }).join('');
  }
  function renderShop() {
    $('#shop').innerHTML = SKINS.map(function (k) {
      var own = S.skins[k.id], on = S.skin === k.id;
      return '<div class="card' + (on ? ' got' : '') + '"><svg class="st" viewBox="-20 -24 40 40" aria-hidden="true"><circle cy="-2" r="13" fill="#ffd9b0" stroke="#1d2a4a" stroke-width="2.5"/><path d="M-15 -4 Q0 -30 15 -4Z" fill="' + k.hat + '" stroke="#1d2a4a" stroke-width="2.5" stroke-linejoin="round"/><rect x="-18" y="-5" width="36" height="5" rx="2.5" fill="' + k.hat + '" stroke="#1d2a4a" stroke-width="2.5"/></svg><div><h3>' + tKey('shop.skin.' + k.id, k.name) + '</h3><p>' + (on ? t('avatar.wearing') : own ? t('avatar.owned') : k.price + (locale === 'pt' ? ' moedas' : ' coins')) + '</p>' + (on ? '' : '<button class="btn go" type="button" data-act="' + (own ? 'equip' : 'buy') + '" data-id="' + k.id + '">' + (own ? t('avatar.wear') : t('avatar.buy')) + '</button>') + '</div></div>';
    }).join('');
  }
  function skinAct(act, id) {
    var k = skinById(id), msg = $('#shopMsg');
    if (act === 'buy' && !S.skins[id]) {
      if (S.coins < k.price) { msg.textContent = tr('avatar.need', { count: k.price - S.coins, name: tKey('shop.skin.' + k.id, k.name) }); blip([300, 220], .1); return; }
      S.coins -= k.price; S.skins[id] = 1;
    }
    if (!S.skins[id]) return;
    S.skin = id; save(); applySkin(); renderHud(); renderShop();
    $('#shopMsg').textContent = tr('avatar.nowwearing', { name: tKey('shop.skin.' + k.id, k.name) }); blip([660, 880, 1100], .08); confetti(40);
  }
  setLocale(locale);
  renderHud(); renderDock(); renderGrid(); renderItems(); renderShop(); applySkin(); updateCompass();
  initializeStudioShop().catch(function (error) {
    console.error('Studio Shop initialization failed.', error);
    var status = document.querySelector('#studioShopStatus');
    status.textContent = 'Studio Shop could not initialize. Reload and try again.';
    status.classList.add('is-error');
  });
})();
