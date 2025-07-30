# Conceito de Design - Site de Café e Delivery

## Visão Geral
Site moderno e responsivo para pedidos de café e delivery, focado em uma experiência de usuário intuitiva e visualmente atraente, inspirado nas melhores práticas de design de cafeterias e aplicativos de delivery.

## Paleta de Cores
- **Primária**: #8B4513 (Marrom café escuro)
- **Secundária**: #D2B48C (Bege claro)
- **Accent**: #FF6B35 (Laranja vibrante)
- **Neutros**: 
  - #FFFFFF (Branco)
  - #F5F5F5 (Cinza muito claro)
  - #333333 (Cinza escuro)
  - #000000 (Preto)

## Tipografia
- **Fonte Principal**: Inter ou Poppins (moderna e legível)
- **Tamanhos**:
  - Título Principal: 48px (desktop) / 32px (mobile)
  - Subtítulos: 24px (desktop) / 20px (mobile)
  - Corpo do texto: 16px
  - Botões: 14px (peso semibold)

## Layout e Estrutura

### Página Inicial
- **Hero Section**: Imagem de fundo com café, título impactante e CTA principal
- **Seção de Produtos**: Grid de cafés em destaque
- **Sobre Nós**: Breve descrição da cafeteria
- **Depoimentos**: Avaliações de clientes
- **Footer**: Links úteis e informações de contato

### Cardápio
- **Filtros**: Por categoria (Espresso, Cappuccino, Frappé, etc.)
- **Grid de Produtos**: Cards com imagem, nome, descrição e preço
- **Botão "Adicionar ao Carrinho"**: Destaque visual

### Sistema de Pedidos
- **Carrinho**: Sidebar ou modal com itens selecionados
- **Checkout**: Formulário de dados de entrega
- **Confirmação**: Página de sucesso com número do pedido

### Autenticação
- **Login/Cadastro**: Modal ou página dedicada
- **Perfil do Usuário**: Histórico de pedidos e dados pessoais

## Funcionalidades Principais

### Para Clientes
1. **Navegação do Cardápio**
   - Visualização de produtos com imagens
   - Filtros por categoria e preço
   - Busca por nome do produto

2. **Sistema de Carrinho**
   - Adicionar/remover itens
   - Ajustar quantidades
   - Calcular total com taxas de entrega

3. **Autenticação**
   - Cadastro de novos usuários
   - Login com email/senha
   - Recuperação de senha

4. **Processo de Pedido**
   - Seleção de endereço de entrega
   - Escolha de método de pagamento
   - Confirmação do pedido

5. **Histórico de Pedidos**
   - Visualizar pedidos anteriores
   - Status de entrega
   - Repetir pedidos

### Para Administração (Futuro)
- Gerenciamento de produtos
- Controle de pedidos
- Relatórios de vendas

## Experiência do Usuário

### Interações e Animações
- **Hover Effects**: Nos botões e cards de produtos
- **Transições Suaves**: Entre páginas e estados
- **Loading States**: Durante carregamento de dados
- **Micro-interações**: Feedback visual para ações do usuário

### Responsividade
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

### Acessibilidade
- Contraste adequado entre cores
- Navegação por teclado
- Textos alternativos para imagens
- Estrutura semântica HTML

## Tecnologias Planejadas

### Frontend
- **React**: Framework principal
- **Tailwind CSS**: Estilização
- **React Router**: Navegação
- **Axios**: Requisições HTTP
- **React Hook Form**: Formulários

### Backend
- **Flask**: API REST
- **SQLite**: Banco de dados
- **JWT**: Autenticação
- **Flask-CORS**: Suporte a CORS

## Páginas e Componentes

### Páginas Principais
1. **Home** (`/`)
2. **Cardápio** (`/menu`)
3. **Carrinho** (`/cart`)
4. **Login** (`/login`)
5. **Cadastro** (`/register`)
6. **Perfil** (`/profile`)
7. **Checkout** (`/checkout`)
8. **Confirmação** (`/order-confirmation`)

### Componentes Reutilizáveis
- **Header**: Navegação principal
- **Footer**: Informações e links
- **ProductCard**: Card de produto
- **Button**: Botões estilizados
- **Modal**: Janelas modais
- **Form**: Componentes de formulário
- **Loading**: Indicadores de carregamento

## Fluxo de Usuário

### Novo Cliente
1. Acessa o site
2. Navega pelo cardápio
3. Adiciona itens ao carrinho
4. Cria conta durante checkout
5. Finaliza pedido

### Cliente Retornando
1. Faz login
2. Navega pelo cardápio ou acessa favoritos
3. Adiciona itens ao carrinho
4. Usa endereço salvo
5. Finaliza pedido

Este conceito serve como base para o desenvolvimento do site, garantindo uma experiência consistente e profissional para os usuários.

