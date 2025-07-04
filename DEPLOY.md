# Deploy para Vercel - Instruções

## 1. Configuração da Vercel

### Passo 1: Acesse a Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta do GitHub

### Passo 2: Importar Projeto
- Clique em "New Project"
- Selecione o repositório: `controleGastosFront`
- Clique em "Import"

### Passo 3: Configurar Build
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Passo 4: Variáveis de Ambiente
Adicione as seguintes variáveis de ambiente:

```
VITE_API_URL=https://seu-backend-url.com/api
```

**Importante**: Substitua `https://seu-backend-url.com/api` pela URL real do seu backend.

### Passo 5: Deploy
- Clique em "Deploy"
- Aguarde o build e deploy

## 2. Configuração do Backend (Importante!)

O frontend está configurado para se conectar com o backend. Certifique-se de:

1. **CORS**: O backend deve aceitar requisições do domínio da Vercel
2. **URL da API**: Atualize `VITE_API_URL` com a URL real do backend
3. **HTTPS**: Use HTTPS tanto no frontend quanto no backend

## 3. Estrutura do Projeto

```
controle-gastos/
├── public/
│   └── images/           # Imagens da família
├── src/
│   ├── components/       # Componentes React
│   ├── contexts/         # Context API
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Páginas
│   ├── services/        # Configuração da API
│   └── utils/           # Utilitários
├── .env                 # Variáveis de ambiente (não versionado)
├── vercel.json          # Configuração da Vercel
└── package.json         # Dependências
```

## 4. Funcionalidades

- ✅ Login/Logout
- ✅ Dashboard com filtros mensais
- ✅ Adicionar gastos e receitas
- ✅ Estatísticas mensais
- ✅ Exportar dados
- ✅ Interface responsiva
- ✅ Design moderno com glassmorphism

## 5. Tecnologias Utilizadas

- **React** - Frontend framework
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - HTTP client
- **React Hot Toast** - Notificações
- **React Icons** - Ícones
- **CSS3** - Estilos modernos
