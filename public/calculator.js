const calculator = {
  display: null,
  history: null,
  currentInput: '0',
  shouldResetDisplay: false,
  memory: 0,
  lastOperation: '',
  isDegreeMode: true,

  init() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
        window.location.href = '/login.html';
        return;
    }

    this.display = document.getElementById('display');
    this.history = document.getElementById('history');
    this.updateDisplay();
    this.addEventListeners();
  },

  inputNumber(num) {
    if (this.shouldResetDisplay || this.currentInput === '0') {
      this.currentInput = num;
      this.shouldResetDisplay = false;
    } else {
      this.currentInput += num;
    }
    this.updateDisplay();
  },

  inputOperator(op) {
    if (this.currentInput === '' || this.currentInput === '0') return;
    
    if (op === '^') {
      this.currentInput += '^';
    } else if (op === '×') {
      this.currentInput += '*';
    } else {
      this.currentInput += op;
    }
    this.updateDisplay();
  },

  inputDecimal() {
    if (this.shouldResetDisplay) {
      this.currentInput = '0.';
      this.shouldResetDisplay = false;
    } else if (this.currentInput.split(/[\+\-\*\/]/).pop().indexOf('.') === -1) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  },

  clearAll() {
    this.currentInput = '0';
    if (this.history) {
      this.history.textContent = '';
    }
    this.updateDisplay();
  },

  clearEntry() {
    this.currentInput = '0';
    this.updateDisplay();
  },

  deleteLast() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    this.updateDisplay();
  },

  toggleSign() {
    if (this.currentInput !== '0') {
      if (this.currentInput.startsWith('-')) {
        this.currentInput = this.currentInput.substring(1);
      } else {
        this.currentInput = '-' + this.currentInput;
      }
      this.updateDisplay();
    }
  },

  scientificFunction(func) {
    try {
      let value = parseFloat(this.currentInput);
      let result;

      switch (func) {
        case 'sin':
          result = math.sin(this.isDegreeMode ? math.unit(value, 'deg') : value);
          break;
        case 'cos':
          result = math.cos(this.isDegreeMode ? math.unit(value, 'deg') : value);
          break;
        case 'tan':
          result = math.tan(this.isDegreeMode ? math.unit(value, 'deg') : value);
          break;
        case 'asin':
          result = math.asin(value);
          if (this.isDegreeMode) result = result.toNumber('deg');
          break;
        case 'acos':
          result = math.acos(value);
          if (this.isDegreeMode) result = result.toNumber('deg');
          break;
        case 'atan':
          result = math.atan(value);
          if (this.isDegreeMode) result = result.toNumber('deg');
          break;
        case 'ln':
          result = math.log(value);
          break;
        case 'log':
          result = math.log10(value);
          break;
        case 'exp':
          result = math.exp(value);
          break;
        case '10pow':
          result = math.pow(10, value);
          break;
        case 'sqrt':
          result = math.sqrt(value);
          break;
        case 'fact':
          result = math.factorial(value);
          break;
      }

      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Resultado inválido');
      }

      this.history.textContent = `${func}(${this.currentInput}) =`;
      this.currentInput = this.formatResult(result);
      this.shouldResetDisplay = true;
      this.updateDisplay();
    } catch (error) {
      this.showError('Error en cálculo');
    }
  },

  factorial(n) {
    if (n < 0 || n !== Math.floor(n)) throw new Error('Factorial de número negativo o decimal');
    if (n > 170) throw new Error('Número demasiado grande');
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },

  insertConstant(constant) {
    if (this.shouldResetDisplay || this.currentInput === '0') {
      this.currentInput = constant === 'pi' ? Math.PI.toString() : Math.E.toString();
      this.shouldResetDisplay = false;
    } else {
      this.currentInput += constant === 'pi' ? Math.PI.toString() : Math.E.toString();
    }
    this.updateDisplay();
  },

  memoryClear() {
    this.memory = 0;
    this.showTemporaryMessage('Memoria limpiada');
  },

  memoryRecall() {
    this.currentInput = this.memory.toString();
    this.shouldResetDisplay = true;
    this.updateDisplay();
  },

  memoryAdd() {
    try {
      this.memory += parseFloat(this.currentInput);
      this.showTemporaryMessage('Agregado a memoria');
    } catch (error) {
      this.showError('Error al agregar a memoria');
    }
  },

  memorySubtract() {
    try {
      this.memory = parseFloat(this.memory) - parseFloat(this.currentInput);
      this.showTemporaryMessage('Sustraído de memoria');
    } catch (error) {
      this.showError('Error al sustraer de memoria');
    }
  },

  calculate() {
    try {
      let expression = this.currentInput;
      this.history.textContent = expression + ' =';
      
      const result = math.evaluate(expression);
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Resultado inválido');
      }

      this.currentInput = this.formatResult(result);
      this.shouldResetDisplay = true;
      this.updateDisplay();
    } catch (error) {
      this.showError('Error de sintaxis');
    }
  },

  updateDisplay() {
    if (this.display) {
      this.display.value = this.currentInput;
      this.display.classList.remove('error');
    }
  },

  showError(message) {
    if (this.display) {
      this.display.value = message;
      this.display.classList.add('error');
    }
    this.currentInput = '0';
    this.shouldResetDisplay = true;
    setTimeout(() => {
      this.updateDisplay();
    }, 2000);
  },

  formatResult(result) {
    if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-15 && result !== 0)) {
      return result.toExponential(6);
    }
    
    let formatted = result.toString();
    if (formatted.length > 12) {
      return parseFloat(result.toPrecision(10)).toString();
    }
    return formatted;
  },

  showTemporaryMessage(message) {
    if (this.history) {
      let originalText = this.history.textContent;
      this.history.textContent = message;
      setTimeout(() => {
        this.history.textContent = originalText;
      }, 1500);
    }
  },

  switchMode(mode) {
    let options = document.querySelectorAll('.toggle-option');
    let scientificPanel = document.getElementById('scientificPanel');
    
    options.forEach(option => option.classList.remove('active'));
    
    if (mode === 'scientific') {
      document.getElementById('mode-scientific').classList.add('active');
      scientificPanel.classList.add('active');
    } else {
      document.getElementById('mode-basic').classList.add('active');
      scientificPanel.classList.remove('active');
    }
  },

  addEventListeners() {
    const logoutButton = document.getElementById('btn-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => this.logout());
    }
    document.getElementById('mode-basic').addEventListener('click', () => this.switchMode('basic'));
    document.getElementById('mode-scientific').addEventListener('click', () => this.switchMode('scientific'));

    document.getElementById('btn-mc').addEventListener('click', () => this.memoryClear());
    document.getElementById('btn-mr').addEventListener('click', () => this.memoryRecall());
    document.getElementById('btn-m-plus').addEventListener('click', () => this.memoryAdd());
    document.getElementById('btn-m-minus').addEventListener('click', () => this.memorySubtract());

    document.getElementById('btn-sin').addEventListener('click', () => this.scientificFunction('sin'));
    document.getElementById('btn-cos').addEventListener('click', () => this.scientificFunction('cos'));
    document.getElementById('btn-tan').addEventListener('click', () => this.scientificFunction('tan'));
    document.getElementById('btn-ln').addEventListener('click', () => this.scientificFunction('ln'));
    document.getElementById('btn-log').addEventListener('click', () => this.scientificFunction('log'));
    document.getElementById('btn-asin').addEventListener('click', () => this.scientificFunction('asin'));
    document.getElementById('btn-acos').addEventListener('click', () => this.scientificFunction('acos'));
    document.getElementById('btn-atan').addEventListener('click', () => this.scientificFunction('atan'));
    document.getElementById('btn-exp').addEventListener('click', () => this.scientificFunction('exp'));
    document.getElementById('btn-10pow').addEventListener('click', () => this.scientificFunction('10pow'));
    document.getElementById('btn-pi').addEventListener('click', () => this.insertConstant('pi'));
    document.getElementById('btn-e').addEventListener('click', () => this.insertConstant('e'));
    document.getElementById('btn-sqrt').addEventListener('click', () => this.scientificFunction('sqrt'));
    document.getElementById('btn-pow').addEventListener('click', () => this.inputOperator('^'));
    document.getElementById('btn-fact').addEventListener('click', () => this.scientificFunction('fact'));

    document.getElementById('btn-ac').addEventListener('click', () => this.clearAll());
    document.getElementById('btn-ce').addEventListener('click', () => this.clearEntry());
    document.getElementById('btn-del').addEventListener('click', () => this.deleteLast());
    document.getElementById('btn-div').addEventListener('click', () => this.inputOperator('/'));
    document.getElementById('btn-sign').addEventListener('click', () => this.toggleSign());

    document.getElementById('btn-7').addEventListener('click', () => this.inputNumber('7'));
    document.getElementById('btn-8').addEventListener('click', () => this.inputNumber('8'));
    document.getElementById('btn-9').addEventListener('click', () => this.inputNumber('9'));
    document.getElementById('btn-mul').addEventListener('click', () => this.inputOperator('×'));
    document.getElementById('btn-lpar').addEventListener('click', () => this.inputOperator('('));

    document.getElementById('btn-4').addEventListener('click', () => this.inputNumber('4'));
    document.getElementById('btn-5').addEventListener('click', () => this.inputNumber('5'));
    document.getElementById('btn-6').addEventListener('click', () => this.inputNumber('6'));
    document.getElementById('btn-sub').addEventListener('click', () => this.inputOperator('-'));
    document.getElementById('btn-rpar').addEventListener('click', () => this.inputOperator(')'));

    document.getElementById('btn-1').addEventListener('click', () => this.inputNumber('1'));
    document.getElementById('btn-2').addEventListener('click', () => this.inputNumber('2'));
    document.getElementById('btn-3').addEventListener('click', () => this.inputNumber('3'));
    document.getElementById('btn-add').addEventListener('click', () => this.inputOperator('+'));
    document.getElementById('btn-dot').addEventListener('click', () => this.inputDecimal());

    document.getElementById('btn-0').addEventListener('click', () => this.inputNumber('0'));
    document.getElementById('btn-eq').addEventListener('click', () => this.calculate());

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            this.inputOperator(key === '*' ? '*' : key);
        } else if (key === '.') {
            this.inputDecimal();
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape') {
            this.clearAll();
        } else if (key === 'Backspace') {
            this.deleteLast();
        } else if (key === '(' || key === ')') {
            this.inputOperator(key);
        }
    });
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = calculator;
} else {
  document.addEventListener('DOMContentLoaded', () => calculator.init());
}
