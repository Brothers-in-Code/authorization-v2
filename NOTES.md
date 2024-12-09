# Заметки

## JEST 

### Подключение к БД

```ts
import DataSource from 'src/test-data-source';

beforeAll(async () => {
 await DataSource.initialize();
});
afterAll(async () => {
 await DataSource.destroy();
});
```
### paths в package.json
убрал, потому что ругался jest, но мало ли надо будет вернуть
```json
{
  "paths": {
    "./src/*": [
      "./src/*"
    ]
  }
}
```