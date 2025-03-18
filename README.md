# My Flask React App

Este projeto é uma aplicação web que utiliza Flask como backend e React como frontend. A aplicação é estruturada para separar as responsabilidades entre o backend e o frontend, permitindo um código limpo e de fácil manutenção.

## Estrutura do Projeto

```
tickets
├── backend
│   ├── app
│   │   ├── __init__.py          # Inicializa a aplicação Flask e registra os blueprints
│   │   ├── models.py            # Define os modelos SQLAlchemy para a aplicação
│   │   ├── routes               # Contém definições de rotas organizadas por blueprints
│   │   │   ├── login
│   │   │   │   ├── controller.py # Controlador para as rotas de login
│   │   │   │   └── views.py      # Vistas para as rotas de login
│   │   │   ├── register
│   │   │   │   ├── controller.py # Controlador para as rotas de registro
│   │   │   │   └── views.py      # Vistas para as rotas de registro
│   ├── config.py                # Configurações para a aplicação Flask
│   ├── run.py                   # Ponto de entrada para executar a aplicação Flask
│   ├── requirements.txt         # Lista de dependências para o backend
│   └── .env                     # Variáveis de ambiente para a aplicação
├── frontend
│   ├── public                   # Contém ativos públicos para a aplicação React
│   ├── src                      # Arquivos fonte para a aplicação React
│   │   ├── components           # Componentes reutilizáveis do React
│   │   ├── pages                # Páginas principais da aplicação React
│   │   ├── App.js               # Componente principal da aplicação React
│   │   ├── index.js             # Ponto de entrada para a aplicação React
│   │   └── setupProxy.js        # Configura um proxy para requisições API ao backend
│   ├── package.json             # Arquivo de configuração para npm
│   ├── .babelrc                 # Configurações do Babel
│   ├── .eslintrc.js             # Configurações do ESLint
│   └── webpack.config.js        # Configurações do Webpack
└── README.md                    # Documentação do projeto
```

## Começando

### Pré-requisitos

- Python 3.x
- Node.js e npm

### Configuração do Backend

1. Navegue até o diretório `backend`:
   ```
   cd backend
   ```

2. Instale os pacotes Python necessários:
   ```
   pip install -r requirements.txt
   ```

3. Execute a aplicação Flask:
   ```
   python run.py
   ```

### Configuração do Frontend

1. Navegue até o diretório `frontend`:
   ```
   cd frontend
   ```

2. Instale os pacotes npm necessários:
   ```
   npm install
   ```

3. Inicie a aplicação React:
   ```
   npm start
   ```

### Configuração do Proxy da API

A aplicação React está configurada para fazer proxy das requisições API para o backend Flask durante o desenvolvimento. Certifique-se de que o backend está rodando na porta especificada (padrão é 5000) para que o proxy funcione corretamente.

## Uso

Uma vez que o backend e o frontend estejam rodando, você pode acessar a aplicação no seu navegador web em `http://localhost:3000`. O frontend React se comunicará com o backend Flask para buscar e enviar dados conforme necessário.