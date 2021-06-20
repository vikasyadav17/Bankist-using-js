'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const transaction = function (movement1) {
  containerMovements.innerHTML = ' ';
  movement1.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// transaction(account1.movements);

const createUserName = acc =>
  acc.forEach(function (account) {
    account.user = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });

createUserName(accounts);
// console.log(accounts);

let balance;
const checkBalance = movement => {
  const currentBalance = movement.reduce(function (acc, mov, i, arr) {
    return acc + mov;
  }, 0);
  //console.log(currentBalance);
  balance = currentBalance;
  labelBalance.textContent = `${currentBalance}€`;
};

const calcDisplaySummary = movements => {
  const moneyDeposited = movements
    .filter(mov => {
      return mov > 0;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${moneyDeposited}€`;

  const moneyWithdrew = movements
    .filter((mov, i, arr) => {
      return mov < 0;
    })
    .reduce((acc, mov, i, arr) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(moneyWithdrew)}€`;

  const interest = movements
    .filter((mov, i, arr) => mov > 0)
    .map((mov, i, arr) => (mov * 1.2) / 100)
    .filter(function (mov, i, arr) {
      return mov >= 1;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const update = account => {
  transaction(enteredUser.movements);
  checkBalance(enteredUser.movements);
  calcDisplaySummary(enteredUser.movements);
};

let enteredUser;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('LOGIN');
  enteredUser = accounts.find(function (acc, i) {
    return inputLoginUsername.value == acc.user;
  });
  console.log(enteredUser.pin);

  if (enteredUser.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    console.log('correct credentials');

    labelWelcome.textContent = `Welcome back , ${
      enteredUser.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';

    update(enteredUser);
  }
});

btnTransfer.addEventListener('click', function (e) {
  console.log(`clicked`);
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  console.log(amount);

  const transferTo = accounts.find(function (acc) {
    return inputTransferTo.value === acc.user;
  });
  console.log(balance);
  console.log(transferTo);
  if (
    amount > 0 &&
    transferTo &&
    balance >= amount &&
    transferTo?.user !== enteredUser.user
  ) {
    console.log(`i am here`);
    inputTransferTo.value = inputTransferAmount.value = '';
    enteredUser.movements.push(-amount);
    transferTo.movements.push(amount);

    update(enteredUser.movements);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('delete');
  const closingUser = inputCloseUsername.value;
  const closingPin = Number(inputClosePin.value);
  if (enteredUser.user === closingUser && enteredUser.pin === closingPin) {
    const i = accounts.findIndex(acc => acc.user === enteredUser.user);
    accounts.splice(i, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedLoan = Number(inputLoanAmount.value);
  const minDeposit = 0.1 * requestedLoan;
  if (enteredUser.movements.some(mov => mov >= minDeposit))
    enteredUser.movements.push(requestedLoan);
  update(enteredUser.movements);
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const joinedMovements = accounts.map(mov => mov.movements);
// const sum1 = joinedMovements.flat();
// const sum = sum1.reduce((acc, current) => {
//   return acc + current;
// }, 0);
// console.log(sum);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// calcDisplaySummary(movements);
/////////////////////////////////////////////////

labelBalance.addEventListener('click', function () {
  const movements = Array.from(document.querySelectorAll('.movements__value'));
  const movementsMap = movements.map(curr =>
    Number(curr.textContent.replace('€', ''))
  );
  console.log(movementsMap);
});
