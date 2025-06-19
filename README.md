<div align="center">
<img src="https://d3dpbaewouik5z.cloudfront.net/imgs/piggy-bank-512x512.png" alt="Finax Logo" width="80"/>
  
  <h1>Finax Frontend</h1>
  <p>Sistema de controle financeiro pessoal, focado em fluxo de caixa.</p>
  
  <a href="https://appfinax.com.br"><img src="https://img.shields.io/badge/Online-Demo-green?style=flat-square" alt="Demo Online"></a>
  <img src="https://img.shields.io/badge/Angular-19-red?style=flat-square" alt="Angular 19">
  <img src="https://img.shields.io/badge/SSR-Ativo-blue?style=flat-square" alt="SSR Ativo">
</div>

---

## ✨ Sobre o Projeto

O **Finax** é um sistema web para controle financeiro pessoal, desenvolvido em Angular 19 com Server-Side Rendering (SSR). Permite gerenciar receitas, despesas, investimentos, cartões de crédito, metas de gastos e muito mais, com uma interface moderna e responsiva.

> **Este repositório refere-se apenas ao frontend do projeto.**

---

## 🚀 Tecnologias Utilizadas

- [Angular 19](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [SSR](https://angular.dev/guide/performance) (Server-Side Rendering)
- [Nginx](https://www.nginx.com/) (deploy)
- [Oracle cloud](https://www.oracle.com/br/cloud/compute/virtual-machines/) (servidores)
- [Aws S3](https://aws.amazon.com/pt/s3/) (armazenamento de arquivos)
- [Aws CloudFront](https://aws.amazon.com/pt/cloudfront/) (distribuição de conteúdo)

---

## 🛠️ Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/gabriel-hawerroth/finax-frontend.git
   cd finax-frontend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o servidor de desenvolvimento:**
   ```bash
   ng s
   ```
4. Acesse em `http://localhost:4200`

---

## 📂 Estrutura do Projeto

```
finax-frontend/
├── src/
│   ├── app
│   │   ├── core/      # Entidades, serviços, eventos, guards...
│   │   ├── main/      # Componentes principais da telas
│   │   └── shared/    # Componentes reutilizáveis e utilitários
│   ├── assets/        # Imagens e arquivos estáticos
│   └── environments/  # Configurações de ambiente
├── angular.json
├── package.json
└── ...
```

---

## 👤 Autor

- Gabriel ([@gabriel-hawerroth](https://github.com/gabriel-hawerroth))

---

## 📄 Licença

Este projeto é de propriedade exclusiva do autor. É permitido rodar localmente para fins de avaliação e testes pessoais.

**Não é permitida** a distribuição, publicação, modificação ou uso comercial sem autorização prévia do autor.

---

## 📸 Screenshots

<div align="center">
  <img src="https://d3dpbaewouik5z.cloudfront.net/imgs/demonstracao/landing-page.png" alt="Tela Principal" width="600"/>
  <br/>
  <img src="https://d3dpbaewouik5z.cloudfront.net/imgs/demonstracao/tela-inicial.png" alt="Dashboard" width="600"/>
  <br/>
  <img src="https://d3dpbaewouik5z.cloudfront.net/imgs/demonstracao/fluxo-caixa.png" alt="Dashboard" width="600"/>
  <br/>
  <img src="https://d3dpbaewouik5z.cloudfront.net/imgs/demonstracao/categorias.png" alt="Dashboard" width="600"/>
</div>
