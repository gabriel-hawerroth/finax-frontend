# Angular e Node

Para rodar o projeto é necessário ter o Node e o npm instalados nas versões:

- Node 22.6
- Npm na última versão

# Git

Trabalhar sempre com base na branch `develop` e criar uma nova branch a partir dela para desenvolver uma nova feature.  
Ao terminar a feature abrir um pull request para a branch `develop` e solicitar a revisão de outro membro do time.

# Patterns

- Todo componente deve ser `standalone` e ter o `detectionStrategy OnPush`
- Injeção de dependências sempre com readonly
- Requisições http sempre convertidas para Promise
- Toda variável usada no template html deve ser um Signal
