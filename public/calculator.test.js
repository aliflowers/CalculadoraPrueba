describe('Calculator Logic', () => {
  let calculator;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="display"></div>
      <div id="history"></div>
      <div id="mode-basic"></div>
      <div id="mode-scientific"></div>
      <div id="scientificPanel"></div>
      <button id="btn-mc"></button>
      <button id="btn-mr"></button>
      <button id="btn-m-plus"></button>
      <button id="btn-m-minus"></button>
      <button id="btn-sin"></button>
      <button id="btn-cos"></button>
      <button id="btn-tan"></button>
      <button id="btn-ln"></button>
      <button id="btn-log"></button>
      <button id="btn-asin"></button>
      <button id="btn-acos"></button>
      <button id="btn-atan"></button>
      <button id="btn-exp"></button>
      <button id="btn-10pow"></button>
      <button id="btn-pi"></button>
      <button id="btn-e"></button>
      <button id="btn-sqrt"></button>
      <button id="btn-pow"></button>
      <button id="btn-fact"></button>
      <button id="btn-ac"></button>
      <button id="btn-ce"></button>
      <button id="btn-del"></button>
      <button id="btn-div"></button>
      <button id="btn-sign"></button>
      <button id="btn-7"></button>
      <button id="btn-8"></button>
      <button id="btn-9"></button>
      <button id="btn-mul"></button>
      <button id="btn-lpar"></button>
      <button id="btn-4"></button>
      <button id="btn-5"></button>
      <button id="btn-6"></button>
      <button id="btn-sub"></button>
      <button id="btn-rpar"></button>
      <button id="btn-1"></button>
      <button id="btn-2"></button>
      <button id="btn-3"></button>
      <button id="btn-add"></button>
      <button id="btn-dot"></button>
      <button id="btn-0"></button>
      <button id="btn-eq"></button>
    `;
    calculator = require('./calculator');
    calculator.init();
    calculator.clearAll();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should input numbers correctly', () => {
    calculator.inputNumber('7');
    expect(calculator.currentInput).toBe('7');
    calculator.inputNumber('8');
    expect(calculator.currentInput).toBe('78');
  });

  test('should perform basic addition', () => {
    calculator.inputNumber('5');
    calculator.inputOperator('+');
    calculator.inputNumber('3');
    calculator.calculate();
    expect(calculator.currentInput).toBe('8');
  });

  test('should perform basic subtraction', () => {
    calculator.inputNumber('10');
    calculator.inputOperator('-');
    calculator.inputNumber('4');
    calculator.calculate();
    expect(calculator.currentInput).toBe('6');
  });

  test('should perform basic multiplication', () => {
    calculator.inputNumber('6');
    calculator.inputOperator('×');
    calculator.inputNumber('7');
    calculator.calculate();
    expect(calculator.currentInput).toBe('42');
  });

  test('should perform basic division', () => {
    calculator.inputNumber('20');
    calculator.inputOperator('/');
    calculator.inputNumber('5');
    calculator.calculate();
    expect(calculator.currentInput).toBe('4');
  });

  test('should handle decimal points correctly', () => {
    calculator.inputDecimal();
    calculator.inputNumber('5');
    expect(calculator.currentInput).toBe('0.5');
    calculator.inputOperator('+');
    calculator.inputNumber('0');
    calculator.inputDecimal();
    calculator.inputNumber('5');
    calculator.calculate();
    expect(calculator.currentInput).toBe('1');
  });

  test('should clear the display', () => {
    calculator.inputNumber('123');
    calculator.clearEntry();
    expect(calculator.currentInput).toBe('0');
  });

  test('should clear all', () => {
    calculator.inputNumber('123');
    calculator.inputOperator('+');
    calculator.inputNumber('456');
    calculator.clearAll();
    expect(calculator.currentInput).toBe('0');
    expect(calculator.history.textContent).toBe('');
  });

  test('should delete the last character', () => {
    calculator.inputNumber('123');
    calculator.deleteLast();
    expect(calculator.currentInput).toBe('12');
  });

  test('should toggle the sign', () => {
    calculator.inputNumber('5');
    calculator.toggleSign();
    expect(calculator.currentInput).toBe('-5');
    calculator.toggleSign();
    expect(calculator.currentInput).toBe('5');
  });

  test('should calculate sine correctly', () => {
    calculator.inputNumber('90');
    calculator.scientificFunction('sin');
    expect(calculator.currentInput).toBe('1');
  });

  test('should calculate cosine correctly', () => {
    calculator.inputNumber('0');
    calculator.scientificFunction('cos');
    expect(calculator.currentInput).toBe('1');
  });

  test('should calculate tangent correctly', () => {
    calculator.inputNumber('45');
    calculator.scientificFunction('tan');
    expect(parseFloat(calculator.currentInput)).toBeCloseTo(1);
  });

  test('should calculate square root correctly', () => {
    calculator.inputNumber('16');
    calculator.scientificFunction('sqrt');
    expect(calculator.currentInput).toBe('4');
  });

  test('should calculate factorial correctly', () => {
    calculator.inputNumber('5');
    calculator.scientificFunction('fact');
    expect(calculator.currentInput).toBe('120');
  });

  test('should insert pi correctly', () => {
    calculator.insertConstant('pi');
    expect(calculator.currentInput).toBe(Math.PI.toString());
  });

  test('should insert e correctly', () => {
    calculator.insertConstant('e');
    expect(calculator.currentInput).toBe(Math.E.toString());
  });

  test('should store and recall from memory', () => {
    calculator.inputNumber('123');
    calculator.memoryAdd();
    calculator.clearAll();
    calculator.memoryRecall();
    expect(calculator.currentInput).toBe('123');
  });

  test('should clear memory', () => {
    calculator.inputNumber('123');
    calculator.memoryAdd();
    calculator.memoryClear();
    calculator.memoryRecall();
    expect(calculator.currentInput).toBe('0');
  });

  test('should subtract from memory', () => {
    calculator.inputNumber('100');
    calculator.memoryAdd();
    calculator.clearAll();
    calculator.inputNumber('25');
    calculator.memorySubtract();
    calculator.memoryRecall();
    expect(calculator.currentInput).toBe('75');
  });
});
