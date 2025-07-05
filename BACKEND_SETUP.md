# Backend Setup - Render

## Problema Atual

O backend no Render está retornando erro 500 com a mensagem: **"no such table: usuarios_usuario"**

Isso indica que as migrações do Django não foram aplicadas no banco de dados SQLite.

## Solução

### 1. Acesso ao Backend no Render

1. Acesse o dashboard do Render: https://dashboard.render.com
2. Vá para o serviço do backend (controlegastosbackend)
3. Acesse a aba "Shell" ou "Console"

### 2. Aplicar Migrações

Execute os seguintes comandos no shell do Render:

```bash
# 1. Verificar o status das migrações
python manage.py showmigrations

# 2. Criar migrações se necessário
python manage.py makemigrations

# 3. Aplicar todas as migrações
python manage.py migrate

# 4. Verificar se as tabelas foram criadas
python manage.py dbshell
.tables
.quit
```

### 3. Criar Superusuário

```bash
# Criar um superusuário para testes
python manage.py createsuperuser

# Use estas credenciais para teste:
# Username: admin
# Email: admin@exemplo.com  
# Password: admin123
```

### 4. Verificar Configurações

Certifique-se de que o `settings.py` do backend tem:

```python
# CORS configurado
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "https://controle-gastos-familia.vercel.app",  # URL da Vercel
    "http://localhost:5173",
    "http://localhost:5174",
]

# Banco de dados configurado
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### 5. Teste do Backend

Após aplicar as migrações, teste se o backend está funcionando:

```bash
# Testar endpoint de login
curl -X POST https://controlegastosbackend.onrender.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Se retornar um token JWT, o backend está funcionando.

## URLs Importantes

- **Backend**: https://controlegastosbackend.onrender.com
- **Frontend**: https://controle-gastos-familia.vercel.app
- **GitHub**: https://github.com/[seu-usuario]/controle-gastos

## Credenciais de Teste

Após criar o superusuário, use para teste:
- **Username**: admin
- **Password**: admin123

## Próximos Passos

1. ✅ Frontend está funcionando na Vercel
2. ❌ Backend precisa das migrações aplicadas no Render
3. ⏳ Teste de integração completa após resolver item 2

## Comandos para Deploy Futuro

```bash
# No Render, sempre execute após mudanças no modelo:
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
```

## Troubleshooting

### Erro: "no such table"
- Execute as migrações: `python manage.py migrate`

### Erro: "CORS policy"
- Verifique CORS_ALLOWED_ORIGINS no settings.py
- Adicione o domínio da Vercel

### Erro: "Authentication failed"
- Verifique se o usuário existe
- Teste com createsuperuser
