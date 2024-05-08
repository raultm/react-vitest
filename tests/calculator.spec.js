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