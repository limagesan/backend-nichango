# backend-nichango
Expressアプリケーション

client side -> https://github.com/limagesan/backend-nichango

## 実行環境

### Node.js
`npm 5.3.0`
`node v8.6.0`

### mongoDB

## install MongoDB
https://qiita.com/Frog_woman/items/f8a70286c7f1c4d5fc02

```shell-session
brew install mongodb
```

```shell-session
sudo mkdir -p /data/db
```

## How to RUN (local)
```shell-session
git clone https://github.com/limagesan/backend-nichango
```

```shell-session
cd backend-nichango
```

```shell-session
npm i
```

```shell-session
sudo mongod
```

```shell-session
npm run start:local
```