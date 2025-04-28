# YamlReader & YamlBuilder

**Bibliotecas TypeScript para manipulação segura de YAML**  

## 🛠️ Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/rafaelfigueredog/yaml-ts.git
cd yaml-ts
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

## 📚 Documentação

### YamlReader
```typescript
import { YamlReader } from './yaml-reader';

const reader = new YamlReader(yamlString);

// Métodos disponíveis:
reader.get('caminho.nested'); // => valor ou undefined
reader.getWithDefault('caminho', padrão); // => valor ou padrão
reader.has('caminho'); // => boolean
reader.section('caminho'); // => novo YamlReader
reader.getAll(); // => objeto completo
```

### YamlBuilder
```typescript
import { YamlBuilder } from './yaml-builder';

const builder = new YamlBuilder(yamlString);

// Métodos disponíveis:
builder.edit('caminho', valor); // => this (fluent interface)
builder.remove('caminho'); // => this
builder.extract(['caminho1', 'caminho2']); // => this
builder.toObject(); // => objeto resultante
builder.toString(); // => YAML resultante
```

## 🧪 Testes
Execute os testes com:
```bash
npm test
# ou
yarn test
```

## 📝 Exemplo Completo

```typescript
import { YamlReader, YamlBuilder } from './src';

// 1. Leitura segura
const config = `
server:
  port: 3000
  auth:
    secret: 'super-secret'
`;

const reader = new YamlReader(config);
const port = reader.getWithDefault('server.port', 8080);
const secretExists = reader.has('server.auth.secret');

// 2. Modificação segura
const updatedConfig = new YamlBuilder(config)
  .edit('server.port', 4000)
  .remove('server.auth.secret')
  .toString();
```

## 🤝 Contribuição
Contribuições são bem-vindas! Siga os passos:
1. Faça um fork do projeto
2. Crie sua branch (`git checkout -b feature/foo`)
3. Commit suas mudanças (`git commit -am 'Add some foo'`)
4. Push para a branch (`git push origin feature/foo`)
5. Abra um Pull Request

## 📜 Licença
MIT © @rafaelfigueredog
