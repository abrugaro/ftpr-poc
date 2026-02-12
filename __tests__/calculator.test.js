const Calculator = require('../src/calculator');
const fs = require('fs');
const path = require('path');

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(5, 3)).toBe(8);
    });

    test('should add negative numbers', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
    });

    test('should add positive and negative numbers', () => {
      expect(calculator.add(5, -3)).toBe(2);
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers', () => {
      expect(calculator.subtract(10, 4)).toBe(6);
    });

    test('should subtract negative numbers', () => {
      expect(calculator.subtract(-10, -4)).toBe(-6);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(calculator.multiply(5, 4)).toBe(20);
    });

    test('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(calculator.multiply(-5, -4)).toBe(20);
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers', () => {
      expect(calculator.divide(20, 4)).toBe(5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero');
    });

    test('should divide negative numbers', () => {
      expect(calculator.divide(-20, -4)).toBe(5);
    });
  });

  describe('percentage', () => {
    test('should calculate percentage correctly', () => {
      expect(calculator.percentage(100, 20)).toBe(20);
    });

    test('should calculate percentage of zero', () => {
      expect(calculator.percentage(0, 50)).toBe(0);
    });
  });
});
