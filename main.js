import 'gardevoir';
import './style.css';

(async () => {
  const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));
  let deadMethod = Math.floor(Math.random() * 5 + 1);
  while (deadMethod !== 1) {
    deadMethod = Math.floor(Math.random() * 5 + 1);
    console.log(deadMethod);
    await sleep(30);
  }
  console.log('----- FOUND 1 -----');
  while (deadMethod !== 2) {
    deadMethod = Math.floor(Math.random() * 5 + 1);
    console.log(deadMethod);
    await sleep(30);
  }
  console.log('----- FOUND 2 -----');
  while (deadMethod !== 3) {
    deadMethod = Math.floor(Math.random() * 5 + 1);
    console.log(deadMethod);
    await sleep(30);
  }
  console.log('----- FOUND 3 -----');
  while (deadMethod !== 4) {
    deadMethod = Math.floor(Math.random() * 5 + 1);
    console.log(deadMethod);
    await sleep(30);
  }
  console.log('----- FOUND 4 -----');
  while (deadMethod !== 5) {
    deadMethod = Math.floor(Math.random() * 5 + 1);
    console.log(deadMethod);
    await sleep(30);
  }
  console.log('----- FOUND 5 -----');
})();

// https://stackoverflow.com/a/9462382
function nFormatter(num, digits = 3) {
  const lookup = [
    // { value: 1, symbol: "" },
    // { value: 1e3, symbol: "k" },
    // { value: 1e6, symbol: "M" },
    // { value: 1e9, symbol: "G" },
    // { value: 1e12, symbol: "T" },
    // { value: 1e15, symbol: "P" },
    // { value: 1e18, symbol: "E" }
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'тыщ' },
    { value: 1e6, symbol: 'мегатыщ' },
    { value: 1e9, symbol: 'мильард' },
    { value: 1e12, symbol: 'трилён' },
    { value: 1e15, symbol: 'квадралион' },
    { value: 1e18, symbol: 'дохулион' },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast(item => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol)
    : '0';
}

const messagesTextarea = document.querySelector('textarea#messages');
const buttonsList = document.querySelector('ul#buttons');
const status = document.querySelector('#status');

const WORKER_PRICE = 5;
const WORKER_EARNS = 5;
const MAX_BALANCE = 1_000_000_000_000_000_000;
const BUTTONS_TITLES = {
  EARN: `Заработать 1 💵`,
  BUY_WORKER: `Купить работника за ${WORKER_PRICE} 💵`,
  BUY_5_WORKERS: `Купить 5 работников за ${WORKER_PRICE * 5} 💵`,
  BUY_WORKER_MAX: 'Купить работников на все деньги',
  ORDER_TO_WORK: 'Отдать приказ работать',
  HELP: 'Справка',
  RESET: 'Сброс игры',
};

const START_MESSAGE = `Привет!

Это простая игра-кликер про карьеру успешного бизнесмена Петровича.

Чтобы начать - нажми "${BUTTONS_TITLES.HELP}"`;

const HELP_MESSAGE = `Вы петрович.

Цель игры - заработать ${nFormatter(
  MAX_BALANCE,
)} 💵. На этом все, у автора не хватило мозгов придумать что-то ещё.

Кнопки

"${BUTTONS_TITLES.EARN}" - пополняет кошелек на 1 💵.

"${
  BUTTONS_TITLES.BUY_WORKER
}" - за ${WORKER_PRICE} 💵 у вас появляется работник приносящий ${WORKER_EARNS} 💵 за нажатие кнопки "${
  BUTTONS_TITLES.ORDER_TO_WORK
}".

"${BUTTONS_TITLES.BUY_5_WORKERS}" - вы покупаете 5 работников.

"${
  BUTTONS_TITLES.BUY_WORKER_MAX
}" - вы покупаете работников на все деньги, что у вас есть. Если у вас 50 💵, купятся ${
  50 / WORKER_PRICE
} работников.

"${
  BUTTONS_TITLES.ORDER_TO_WORK
}" - вы даете работникам команду работать. Если у вас 10 работников, они принесут ${
  WORKER_EARNS * 10
} 💵.

Есть шанс что у вас умрут несколько работников после их отправки на работу.`;

function log(message, addDivider = true) {
  messagesTextarea.value += `${message}
${addDivider ? '--------------------' : ''}
`;
  messagesTextarea.scrollTop = messagesTextarea.scrollHeight;
}

let balance = JSON.parse(localStorage.getItem('balance') || '0');
let workers = JSON.parse(localStorage.getItem('workers') || '0');
// let balance = 0
// let workers = 0
let buttonsBlocked = JSON.parse(
  localStorage.getItem('buttonsBlocked') || 'false',
);

function updateStatus() {
  status.innerText = `Баланс - ${nFormatter(
    balance,
  )} 💵, работников - ${nFormatter(workers)}`;
}

function updateBalance(newValue) {
  balance = newValue;
  updateStatus();
  localStorage.setItem('balance', JSON.stringify(balance));
}

function updateWorkers(newValue) {
  workers = newValue;
  updateStatus();
  localStorage.setItem('workers', JSON.stringify(workers));
}

function updateBlockButtons(newValue) {
  buttonsBlocked = newValue;
  localStorage.setItem('buttonsBlocked', JSON.stringify(buttonsBlocked));
}

updateStatus();

function buyWorker(amount) {
  if (amount > 0 && balance >= WORKER_PRICE * amount) {
    updateBalance(balance - WORKER_PRICE * amount);
    updateWorkers(workers + amount);
    log(`Вы купили ${nFormatter(amount)} работников.`);
  } else {
    log(
      `Недостаточно денег! Нужно ${nFormatter(
        WORKER_PRICE * (amount || 1),
      )} 💵, у вас ${nFormatter(balance)} 💵`,
    );
  }
}

function buyWorkerMax() {
  buyWorker(Math.floor(balance / WORKER_PRICE));
}

const buttonsData = [
  {
    title: BUTTONS_TITLES.EARN,
    action: () => {
      updateBalance(balance + 1);
      log(`Вы заработали 1 💵.`);
    },
  },
  {
    title: BUTTONS_TITLES.BUY_WORKER,
    action: () => {
      buyWorker(1);
    },
  },
  {
    title: BUTTONS_TITLES.BUY_5_WORKERS,
    action: () => {
      buyWorker(5);
    },
  },
  {
    title: BUTTONS_TITLES.BUY_WORKER_MAX,
    action: () => {
      buyWorkerMax();
    },
  },
  {
    title: BUTTONS_TITLES.ORDER_TO_WORK,
    action: () => {
      const profit = WORKER_EARNS * workers;
      updateBalance(balance + profit);
      log(`Ваши работники заработали ${nFormatter(profit)} 💵.`);
    },
  },
  {
    dontBlockAfterWin: true,
    title: BUTTONS_TITLES.HELP,
    action: () => {
      log(HELP_MESSAGE);
    },
  },
  {
    dontBlockAfterWin: true,
    title: BUTTONS_TITLES.RESET,
    action: () => {
      updateBalance(0);
      updateWorkers(0);
      updateBlockButtons(false);
      window.location.reload();
    },
  },
];

buttonsData.forEach(buttonData => {
  const button = document.createElement('button');
  button.innerText = buttonData.title;
  button.addEventListener('click', () => {
    if (!buttonsBlocked || buttonData.dontBlockAfterWin) {
      buttonData.action();

      let deadChance = 0.05;
      if (workers > 10) deadChance = 0.1;

      let deadMax = (workers / 100) * 90;

      if (workers > 0 && Math.random() < deadChance) {
        let forDead = Math.floor(Math.random() * deadMax);
        if (forDead > workers) forDead = workers;
        if (forDead > 0) {
          let deadMethod = Math.floor(Math.random() * 5);
          // let deadMethod = 2;
          if (deadMethod === 0) {
            log(
              `${nFormatter(
                forDead,
              )} ваших работников умерли на работе от инсульта в мучениях (зачем?)`,
            );
            updateWorkers(workers - forDead);
          } else if (deadMethod === 1) {
            log(
              `У вас сдала психика и вы расчленили ${nFormatter(
                forDead,
              )} своих работников. Ну и правильно`,
            );
            updateWorkers(workers - forDead);
          } else if (deadMethod === 2) {
            const balanceStolenPercents = Math.floor(Math.random() * 100);
            const balanceForStole = Math.floor(
              (balance / 100) * balanceStolenPercents,
            );
            log(
              `Пришла толпа милых котиков. Они загрызли и съели ${nFormatter(
                forDead,
              )} ваших работников.${
                balance > 0 && balanceForStole > 0
                  ? ` А ещё спиздили у вас квартиру где деньги лежат (там было ${balanceStolenPercents}% от ${nFormatter(
                      balance,
                    )} деняк - итого ${nFormatter(balanceForStole)} 💵)`
                  : ''
              }`,
            );
            if (balance > 0) updateBalance(balance - balanceForStole);
            updateWorkers(workers - forDead);
          } else if (deadMethod === 3) {
            log(
              `От внезапной хвори у вас умерло ${nFormatter(
                forDead,
              )} работников.`,
            );
            updateWorkers(workers - forDead);
          } else if (deadMethod === 4) {
            log(
              `Случился неведомый пиздос. У вас умерло ${nFormatter(
                forDead,
              )} работников.`,
            );
            updateWorkers(workers - forDead);
          }
        }
      }

      if (Math.random() < 0.0008) {
        log(
          'У вас взорвался завод - все сбережения сгорели и все работники умерли в мучениях. Нажмите кнопку "Сброс игры" чтобы сброситься с крыши.',
        );
        updateBlockButtons(true);
      }

      if (Math.random() < 0.0008) {
        if (Math.random() < 0.5) {
          log(
            `Вы заебались и умерли, пиздец, горе то какое. Все досталось вашим ебучим детям от вашей ебучей бабушки которых всех зовут Петровичами. Нажмите кнопку "Сброс игры" чтобы управлять их сознанием.`,
          );
        } else {
          log(
            `Здравствуйте!    ДОН    Петр    ДОН    Петрович    ДОН    Петровенко,    ДОН    Почта    ДОН    где-то-тамовска    ДОН    сообщает    ДОН    вам    ДОН    что    ДОН    Вы    ДОН    устали,    ДОН    заебались    ДОН    и    ДОН    умерли,    ДОН    НАМ    ДОН    ОЧЕНЬ    ДОН    ЖАЛЬ.    ДОН    А    ДОН    так    ДОН    же    ДОН    абсолютно    ДОН    похуй.    ДОН    Все    ДОН    досталось    ДОН    вашим    ДОН    дорогим    ДОН    наследникам    ДОН    -    ДОН    вашей    ДОН    ебучей    ДОН    дешевой    ДОН    бабушки    ДОН    которую    ДОН    зовут    ДОН    Петровичем.    ДОН    Нажмите    ДОН    кнопку    ДОН    "Сброс    ДОН    игры"    ДОН    чтобы    ДОН    управлять    ДОН    её/их/акын    ДОН    баля    ДОН    сознанием.`,
          );
        }

        updateBlockButtons(true);
      }

      if (Math.random() < 0.0008) {
        log(
          `ПРОИЗОШЕЛ АКЫН БАЛЯ ебучий. вашу планета разъебали инопричленцы. шлёпните па кнопе "Сброс игры" чтобы откатиться до world_backup_${new Date(
            new Date().getTime() + 5000,
          )}`,
        );

        updateBlockButtons(true);
      }

      if (workers > 0 && Math.random() < 0.0008) {
        log(
          `${nFormatter(
            workers,
          )} работников заебались и ебнули вас нахуй. Заново давай.`,
        );

        updateBlockButtons(true);
      }
    }
    if (balance >= MAX_BALANCE) {
      log('Поздравляю! Вы прошли игру.');
      updateBlockButtons(true);
    }
  });

  const listItem = document.createElement('li');
  listItem.appendChild(button);

  buttonsList.appendChild(listItem);
});

log(START_MESSAGE);
if (buttonsBlocked)
  log('Игра окончена. Нажмите "Сброс игры" чтобы начать заново');
