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