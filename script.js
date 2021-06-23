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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const accounts = [account1, account2];

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

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const currentHour = currentDate.getHours();
const currentMinute = currentDate.getMinutes();
labelDate.textContent = `${currentDay}/${currentMonth}/${currentYear}, ${currentHour}:${currentMinute}`;

//Display all transactions 30500
const transaction = function (movement1, sort = false) {
  containerMovements.innerHTML = ' ';
  const movs = sort
    ? enteredUser.movements.sort((a, b) => a - b)
    : enteredUser.movements;
  console.log(movs);
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(enteredUser.movementsDates[i]);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const payementDate = `${day}/${month}/${year}`;
    console.log(date);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${payementDate}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Creating Username for the users;
const createUserName = acc =>
  acc.forEach(function (account) {
    account.user = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });

//calling it so that username could generate automatically
createUserName(accounts);
// console.log(accounts);

let balance;
//checking balance
const checkBalance = movement => {
  const currentBalance = movement.reduce(function (acc, mov, i, arr) {
    return acc + mov;
  }, 0);
  //console.log(currentBalance);
  balance = currentBalance;
  labelBalance.textContent = `${currentBalance}€`;
};

//Displaying everyInfo
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

//this function on call will update everything
const update = account => {
  transaction(enteredUser.movements);
  checkBalance(enteredUser.movements);
  calcDisplaySummary(enteredUser.movements);
};

const startTimer = function(){
  const tick = function(){
    let min = String(Math.trunc(time/60)).padStart(2,0);
    let secs = String(time%60).padStart(2,0);
  
    labelTimer.textContent = `${min}:${secs}`;
    time--;
    if(time == 0){
      clearTimeout(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity=0;
    }

    
  };
 
  let time = 300;
  //deducting 1 sec every 1 sec
  tick();
  const timer = setInterval(tick,1000)


  return timer;
}

let enteredUser,timer;
//login button
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

    if(timer) clearTimeout(timer);
    timer = startTimer();
    update(enteredUser);

  }
});

btnTransfer.addEventListener('click', function (e) {
  console.log(`clicked`);
  e.preventDefault();
  if(timer) clearTimeout(timer);
    timer = startTimer();
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
    enteredUser.movementsDates.push(new Date());
    transferTo.movementsDates.push(new Date());
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

//Loan button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if(timer) clearTimeout(timer);
    timer = startTimer();
  const requestedLoan = Number(inputLoanAmount.value);
  const minDeposit = 0.1 * requestedLoan;
  if (enteredUser.movements.some(mov => mov >= minDeposit)) {
  setTimeout(function(){ 
      enteredUser.movements.push(requestedLoan);
      enteredUser.movementsDates.push(new Date());
      update(enteredUser.movements);
  },5000);
}
 
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
//Displaying current Balance on top right corner

labelBalance.addEventListener('click', function () {
  const movements = Array.from(document.querySelectorAll('.movements__value'));
  const movementsMap = movements.map(curr =>
    Number(curr.textContent.replace('€', ''))
  );
  console.log(movementsMap);
});

let sort = false;
btnSort.addEventListener('click', function (e) {
  transaction(enteredUser.movements, !sort);
  sort = !sort;
});

setTimeout(() => console.log(`heres is your pizza! 🍕`), 3000);

