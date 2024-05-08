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

6. Test custom hook

https://kentcdodds.com/blog/how-to-test-custom-react-hooks

`src/uso-undo.jsx`

```jsx
import * as React from 'react'

const UNDO = 'UNDO'
const REDO = 'REDO'
const SET = 'SET'
const RESET = 'RESET'

function undoReducer(state, action) {
  const {past, present, future} = state
  const {type, newPresent} = action

  switch (action.type) {
    case UNDO: {
      if (past.length === 0) return state

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    }

    case REDO: {
      if (future.length === 0) return state

      const next = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      }
    }

    case SET: {
      if (newPresent === present) return state

      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      }
    }

    case RESET: {
      return {
        past: [],
        present: newPresent,
        future: [],
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

function useUndo(initialPresent) {
  const [state, dispatch] = React.useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  })

  const canUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0
  const undo = React.useCallback(() => dispatch({type: UNDO}), [])
  const redo = React.useCallback(() => dispatch({type: REDO}), [])
  const set = React.useCallback(
    newPresent => dispatch({type: SET, newPresent}),
    [],
  )
  const reset = React.useCallback(
    newPresent => dispatch({type: RESET, newPresent}),
    [],
  )

  return {...state, set, reset, undo, redo, canUndo, canRedo}
}

export default useUndo
```

Tests para ese custom hook `tests/use-undo.jsx`

```jsx
import {renderHook, act} from '@testing-library/react'
import useUndo from '../src/use-undo'
import { describe, expect, it } from "vitest";

describe('hook useUndo', () => {
it('allows you to undo and redo', () => {
  const {result} = renderHook(() => useUndo('one'))

  // assert initial state
  expect(result.current.canUndo).toBe(false)
  expect(result.current.canRedo).toBe(false)
  expect(result.current.past).toEqual([])
  expect(result.current.present).toEqual('one')
  expect(result.current.future).toEqual([])

  // add second value
  act(() => {
    result.current.set('two')
  })

  // assert new state
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(false)
  expect(result.current.past).toEqual(['one'])
  expect(result.current.present).toEqual('two')
  expect(result.current.future).toEqual([])

  // add third value
  act(() => {
    result.current.set('three')
  })

  // assert new state
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(false)
  expect(result.current.past).toEqual(['one', 'two'])
  expect(result.current.present).toEqual('three')
  expect(result.current.future).toEqual([])

  // undo
  act(() => {
    result.current.undo()
  })

  // assert "undone" state
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(true)
  expect(result.current.past).toEqual(['one'])
  expect(result.current.present).toEqual('two')
  expect(result.current.future).toEqual(['three'])

  // undo again
  act(() => {
    result.current.undo()
  })

  // assert "double-undone" state
  expect(result.current.canUndo).toBe(false)
  expect(result.current.canRedo).toBe(true)
  expect(result.current.past).toEqual([])
  expect(result.current.present).toEqual('one')
  expect(result.current.future).toEqual(['two', 'three'])

  // redo
  act(() => {
    result.current.redo()
  })

  // assert undo + undo + redo state
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(true)
  expect(result.current.past).toEqual(['one'])
  expect(result.current.present).toEqual('two')
  expect(result.current.future).toEqual(['three'])

  // add fourth value
  act(() => {
    result.current.set('four')
  })

  // assert final state (note the lack of "third")
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(false)
  expect(result.current.past).toEqual(['one', 'two'])
  expect(result.current.present).toEqual('four')
  expect(result.current.future).toEqual([])
})
});
```