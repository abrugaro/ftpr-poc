const Calculator = require('./calculator');

const calc = new Calculator();

console.log('Calculator Demo');
console.log('===============');
console.log('10 + 5 =', calc.add(10, 5));
console.log('10 - 5 =', calc.subtract(10, 5));
console.log('10 * 5 =', calc.multiply(10, 5));
console.log('10 / 5 =', calc.divide(10, 5));
console.log('20% of 100 =', calc.percentage(100, 20));

module.exports = { Calculator };
