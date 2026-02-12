/**
 * Simple calculator module for demonstration purposes
 */

class Calculator {
  /**
   * Add two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  add(a, b) {
    return a + b;
  }

  /**
   * Subtract two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  subtract(a, b) {
    return a - b;
  }

  /**
   * Multiply two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   */
  multiply(a, b) {
    return a * b;
  }

  /**
   * Divide two numbers
   * @param {number} a - Numerator
   * @param {number} b - Denominator
   * @returns {number} Quotient of a and b
   * @throws {Error} If denominator is zero
   */
  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }

  /**
   * Calculate percentage
   * @param {number} value - The value
   * @param {number} percentage - The percentage to calculate
   * @returns {number} The percentage of the value
   */
  percentage(value, percentage) {
    return (value * percentage) / 100;
  }
}

module.exports = Calculator;
