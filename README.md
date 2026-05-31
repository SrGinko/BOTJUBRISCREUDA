# 🤖 Discord Bot – Administração, Diversão & RPG

Bot em **JavaScript** criado para deixar seu servidor mais organizado, divertido e agora com um **sistema completo de RPG interativo** dentro do Discord!  
Ele modera, engaja a comunidade e traz batalhas, heróis e recompensas, tudo com uma interface moderna e dinâmica.

---

## ✨ Principais Recursos

### 🛡️ Administração do Servidor
Comandos para gerenciar canais, cargos, permissões, banimentos e configurações avançadas.

### 🧭 Sistema de Níveis
Ganho automático de XP conforme a interação no servidor.  
Acompanhe sua evolução e conquiste novos cargos e conquistas.

### 🎮 Busca de Jogos
Integração com API externa que retorna detalhes completos de qualquer título diretamente no chat — incluindo imagens, notas e links.

### 💾 Banco de Dados
Todos os dados de usuários, níveis e configurações são armazenados em **SQLite** (com integração opcional ao Supabase), garantindo alto desempenho e persistência.

### 🥇 Ranking
Ranking global de Usuários baseando se em seus níveis e XP

---

## ⚔️ Sistema de RPG Integrado

### 👤 Heróis Personalizados
- Cada jogador pode criar e evoluir seu próprio herói.  
- Equipamentos, inventário e status persistentes no banco de dados.

### 🩸 Batalhas em Tempo Real
- Sistema de combate interativo entre jogadores e inimigos.  
- Turnos automáticos e ações por botão.
- Lógica completa de **dano, cura e XP por vitória**.  
- Eventos de morte, loot e mensagens dinâmicas de resultado.

### 🖼️ Interface Visual Avançada
- Uso do novo sistema **Components v2 do Discord.js**:  
  containers, banners, seções e media galleries.  
- As batalhas e menus RPG são renderizados com **Canvas**, com imagens dinâmicas.  
- Emojis personalizados e ícones visuais criados dinamicamente.

---

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org) – Ambiente de execução JavaScript  
- [Discord.js v14+](https://discord.js.org) – API moderna do Discord  
- [Axios](https://axios-http.com) – Requisições HTTP para integrações externas  
- [SQLite3](https://www.sqlite.org) / [Supabase](https://supabase.com) – Banco de dados local e remoto  
- [Canvas (@napi-rs/canvas)](https://www.npmjs.com/package/@napi-rs/canvas) – Renderização de imagens e interfaces  
- [NestJS](https://nestjs.com) – Backend/API modular para integração com outros serviços  

---

## 🚧 Em Desenvolvimento

- Novos tipos de **inimigos e habilidades únicas**  
- **Missões Diárias** com recompensas
- **Personalização** mais personalização de Perfil

---

## 📜 Licença
Este projeto é de uso pessoal e educacional.  
Sinta-se à vontade para contribuir ou adaptar para seu próprio servidor!

---
