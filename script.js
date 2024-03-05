'use strict';

/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Sankalp Jaiswal',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 799, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-04-18T21:31:17.178Z',
    '2023-05-23T07:42:02.383Z',
    '2023-08-28T09:15:04.904Z',
    '2023-09-01T10:17:24.185Z',
    '2023-11-08T14:11:59.604Z',
    '2024-01-15T17:01:17.194Z',
    '2024-02-18T23:36:17.929Z',
    '2024-02-21T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Dhruv Patil',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-03-01T13:15:33.035Z',
    '2023-05-30T09:48:16.867Z',
    '2023-08-25T06:04:23.907Z',
    '2023-09-25T14:18:46.235Z',
    '2023-10-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2024-01-25T18:49:59.371Z',
    '2024-02-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
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

///////////////////////////////////////////////////
// Functions

//Date Function
const formatMovementDate = function (date, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//Display Movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
     <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
     <div class="movements__date">${displayDate}</div>
     <div class="movements__value">${formattedMov}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//Display Balance

const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//Display Summary

const calDisplaysummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

//UI Update Function
const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc);

  //Display Balance
  calDisplayBalance(acc);

  //Display Summary
  calDisplaysummary(acc);
};

//Logout Timer Function
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call,print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds,stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    //Decrese time
    time--;
  };
  // Set time to 3 minutes
  let time = 120;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// //Fake Login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

///////////////////////////////////////////
//Event Handler
let currentAccount, timer;

////////////////////////////
//Login EventListener

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  // Hide Credential banner on Login
  hideElement();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear Input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //Update UI
    updateUI(currentAccount);
  }
});

////////////////////////////
//Transfer EventListener

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

/////////////////////////
//Loan EventListener

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Add movements or loan Amount
      currentAccount.movements.push(amount);

      //Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1500);
  }
  inputLoanAmount.value = '';
});

//////////////////////////////////////////
// Account Close EventListener
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//////////////////////////////////////////
// Function to create a div element with credentials banner

// Create a div element
var divElement = document.createElement('div');

const credBanner = function () {
  // Add the class 'topRightDiv' to the div
  divElement.classList.add('topRightDiv');
  let bankistInfo =
    'Bankist - simple online banking app<br>' +
    'This application allows users to login, transfer funds to other accounts, borrow funds, or close the account.<br><br>' +
    'You can log in and try it out using one of the following credentials:<br>' +
    'User 1: ID: sj, PIN: 1111<br>' +
    'User 2: ID: dp, PIN: 2222';

  // Set the HTML content of the div
  divElement.innerHTML = bankistInfo;

  // Append the div to the body of the document
  document.body.appendChild(divElement);
};
credBanner();
// Function to hide the element
function hideElement() {
  // Add the 'hidden' class to hide the banner
  divElement.classList.add('hidden');
}
////////////////////////////////////////
//END
