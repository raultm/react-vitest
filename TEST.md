https://www.paradigmadigital.com/dev/testing-react-vitest/

1. Instalar vitest

El primer paso es instalar Vitest como dependencia de desarrollo: 
```sh
npm install -D vitest
```

2. Añadir scripts a package 

```js
"scripts": {
  "test": "vitest run",
  "tdd": "vitest",
  "coverage": "vitest run --coverage"
}
```

3. Test de js sin react

Crear funcion suma en `src/calculator.js`

```js
export const suma = (a,b) => {
    return a + b;
}
```
Crear test para comprobar esa funcion suma en `tests/calculator.spec.js`

```js
import { describe, expect, it } from "vitest";
import { suma } from "../src/calculator";

describe('Función Suma', () => {
    it('Suma debe ser una función', () => {
        expect(typeof suma).toBe('function');
    });

    it('Suma debe sumar correctamente dos números positivos', () => {
        expect(suma(3,4)).toBe(7);
    });
});

```

4. Tests con react

Instalamos dependencias

```sh
npm install -D @testing-library/react
npm install -D happy-dom
```

Añadir en vite.config.js usar entorno de dom

```js [1-3]
export default defineConfig({
  test : {
    environment: 'happy-dom'
  },
  plugins: [react()],
})
```

Component `src/Card.jsx`

```jsx
import { useState } from "react";

const Card = () => {
    const [count, setCount] = useState(0);
    return (
        <div style={{border: 'solid 2px', maxWidth: '500px'}}>
            <h1>Título card</h1>
            Count: <span role="count-indicator">{count}</span>
            <button onClick={() => {setCount((count) => count + 1)}}>Increment</button>
        </div>
    );
}

export default Card;
```

Test `tests/Card.spec.jsx`

```jsx
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

5. Comprobar

```sh
npm run test
```