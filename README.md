# 💰 Controle de Gastos Familiar

Um aplicativo web moderno para controle financeiro familiar, desenvolvido com React e Vite, com integração à API Django.

## 🚀 Funcionalidades

### 📊 Dashboard Interativo
- **Resumo Financeiro**: Visualização clara de receitas, gastos e saldo
- **Filtros Mensais**: Analise suas finanças por mês específico
- **Evolução Temporal**: Gráfico dos últimos 6 meses
- **Estatísticas Detalhadas**: Análise por categoria e fonte de renda

### 💸 Gestão de Gastos
- Cadastro de gastos com categorização
- Validação de dados em tempo real
- Histórico completo de transações
- Análise por categoria

### 💰 Gestão de Receitas
- Cadastro de receitas por fonte
- Múltiplas fontes de renda (salário, freelance, investimentos, etc.)
- Acompanhamento detalhado

### 📈 Análise e Relatórios
- **Filtros Mensais**: Navegação entre meses com controles intuitivos
- **Estatísticas Avançadas**: 
  - Gastos por categoria com percentuais
  - Receitas por fonte
  - Taxa de poupança
  - Valores médios
- **Exportação de Dados**:
  - Formato CSV para Excel
  - Relatórios em texto
  - Impressão direta

### 🎨 Interface Moderna
- Tema escuro elegante
- Design responsivo
- Componentes intuitivos
- Experiência de usuário otimizada

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **React Router** - Navegação
- **React Hot Toast** - Notificações
- **React Number Format** - Formatação de valores

### Estilização
- **CSS Modules** - Estilização modular
- **Flexbox/Grid** - Layout responsivo
- **Gradientes** - Design moderno
- **Animações CSS** - Transições suaves

### Backend (API)
- **Django REST Framework** - API
- **JWT Authentication** - Autenticação
- **PostgreSQL/SQLite** - Banco de dados

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- API Django rodando (backend)

### Passos
1. **Clone o repositório**
   ```bash
   git clone <repo-url>
   cd controle-gastos
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a API**
   - Certifique-se de que a API Django está rodando
   - Ajuste a URL base em `src/services/api.js` se necessário

4. **Execute o desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse o aplicativo**
   - Abra http://localhost:5173 no navegador
   - Faça login com suas credenciais

## 🎯 Como Usar

### 1. **Dashboard Principal**
- Visualize o resumo financeiro geral
- Use os filtros mensais para análise específica
- Navegue entre meses com os controles de seta

### 2. **Filtros Mensais**
- **Seleção de Período**: Escolha mês e ano
- **Navegação Rápida**: Use as setas ← → para navegar
- **Limpar Filtros**: Botão 🗑️ para ver todos os dados

### 3. **Adicionando Transações**
- **Receitas**: Botão "+ Nova Receita"
- **Gastos**: Botão "+ Novo Gasto"
- Preencha os formulários com validação em tempo real

### 4. **Análise de Dados**
- **Gráfico de Barras**: Evolução dos últimos 6 meses
- **Estatísticas**: Breakdown por categoria e fonte
- **Indicadores**: Taxa de poupança, médias, etc.

### 5. **Exportação**
- **CSV**: Para análise no Excel
- **Relatório**: Documento detalhado
- **Impressão**: Versão otimizada para impressão

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── FiltrosMensais.jsx
│   ├── EstatisticasMensais.jsx
│   ├── ResumoUltimosMeses.jsx
│   └── ExportarDados.jsx
├── pages/              # Páginas principais
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── NovoGasto.jsx
│   └── NovaReceita.jsx
├── hooks/              # Hooks customizados
│   ├── useExpenses.js
│   ├── useReceitas.js
│   └── useFiltrosMensais.js
├── contexts/           # Contextos React
│   └── AuthContext.jsx
├── services/           # Serviços e API
│   └── api.js
└── assets/             # Recursos estáticos
```

## 🎨 Funcionalidades de UI/UX

### Tema Escuro
- Design moderno com gradientes
- Cores consistentes em todo o app
- Boa legibilidade e contraste

### Responsividade
- Funciona em desktop, tablet e mobile
- Layouts adaptativos
- Componentes flexíveis

### Interatividade
- Animações suaves
- Feedback visual
- Estados de loading
- Validação em tempo real

## 🔐 Segurança

- Autenticação JWT
- Rotas protegidas
- Validação de dados
- Sanitização de inputs

## 🚀 Próximas Funcionalidades

- [ ] Metas financeiras
- [ ] Categorias personalizadas
- [ ] Gráficos mais avançados
- [ ] Notificações push
- [ ] Backup automático
- [ ] Múltiplos usuários por família

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação
- Verifique os logs do console do navegador

---

**Desenvolvido com ❤️ para famílias que querem controlar melhor suas finanças!**
