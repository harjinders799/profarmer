import moment from 'moment';
import { sumBy } from 'lodash';
import { currencyFormat, dateFormat, dayCount } from '@utils/dateformat';

export function laborHTMLFormat(strings, user, data, work, expense) {

  const total_labour = sumBy(work, o => parseFloat(o?.count));
  const total_labour_amount = sumBy(work, o => parseFloat(o?.count) * parseFloat(o?.rate));
  const given_amount = sumBy(expense, o => parseFloat(o?.amount));
  const final_amount = total_labour_amount - given_amount;
  const final_amount_color = final_amount < 0 ? "red" : "green";

  return `<!DOCTYPE html>
<html>
<head>
  <style>
    table, th, td {
      border: 1px solid black;
      border-collapse: collapse;
      padding: 10px;
    }
    td {
      text-align: center;
    }
    .card {
      width: 100%;
      background-color: #f2f2f2;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .flex-container {
      display: flex;
      justify-content: space-between;
      width: 95%;
    }
    .centered-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .header, .card-section {
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="centered-container">
    <div class="header flex-container">
      <div>
        <h2>${user?.displayName ?? user?.name}</h2>
        <p>${user?.phoneNumber ?? user?.phone}</p>
        <p>${user?.email ?? ''}</p>
      </div>
      <div>
        <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
        <p>${moment().format('lll')}</p>
      </div>
    </div>
    <h2>${data.name}</h2>
  </div>
  <div class="card">
    ${[
      { label: strings.total_labour, value: total_labour },
      { label: strings.labour_amount, value: currencyFormat(total_labour_amount) },
      { label: strings.given_amount, value: currencyFormat(given_amount) },
      { label: strings.final, value: currencyFormat(final_amount), color: final_amount_color }
    ].map(item => `
      <div class="flex-container" ${item.color ? `style="color:${item.color}"` : ''}>
        <h3>${item.label}:</h3>
        <h3>${item.value}</h3>
      </div>
    `).join('')}
  </div>

  <h2 style="padding-top:50px">${strings.labour_record}</h2>
  <table style="width:100%">
    <tr>
      <th>${strings.date}</th>
      <th>${strings.total_labour}</th>
      <th>${strings.labour_rate}</th>
      <th>${strings.total_amount}</th>
      <th>${strings.remark}</th>
    </tr>
    ${work.map(record => `
      <tr>
        <td>${dateFormat(record.date)}</td>
        <td>${record?.count}</td>
        <td>${currencyFormat(record?.rate)}</td>
        <td>${currencyFormat(record?.rate * record?.count)}</td>
        <td width="20%">${record.detail}</td>
      </tr>
    `).join('')}
  </table>

  <h2 style="padding-top:50px">${strings.given_amount}</h2>
  <table style="width:100%">
    <tr>
      <th>${strings.date}</th>
      <th>${strings.amount}</th>
      <th>${strings.remark}</th>
    </tr>
    ${expense.map(record => `
      <tr>
        <td>${dateFormat(record.date)}</td>
        <td>${currencyFormat(record?.amount)}</td>
        <td>${record?.detail}</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>`;
}


export function regularLaborHTMLFormat(strings, user, data, leaves, expense) {
  let days = dayCount(data?.start_date);

  const total_labour_amount =
    days * parseFloat(data?.labour_rate) -
    parseFloat(sumBy(leaves, o => parseFloat(o.count))) *
    parseFloat(data?.labour_rate);

  const given_amount = sumBy(expense, o => parseFloat(o.amount));
  const final_amount = total_labour_amount - given_amount;

  return `<!DOCTYPE html>
  <html>
    <head>
      <style>
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
          padding: 10px;
        }
        td {
          text-align: center;
        }
        .card {
          width: 100%;
          background-color: #f2f2f2;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .flex-container {
          display: flex;
          justify-content: space-between;
          width: 95%;
        }
        .centered-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .header, .card-section {
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="centered-container">
        <div class="header flex-container">
          <div>
            <h2>${user?.displayName ?? user?.name}</h2>
            <p>${user?.phoneNumber ?? user?.phone}</p>
            <p>${user?.email ?? ' '}</p>
          </div>
          <div>
            <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
            <p>${moment().format('lll')}</p>
          </div>
        </div>
        <h2>${data.name}</h2>
      </div>
      <div class="card">
        ${[
      { label: strings.start_date, value: dateFormat(data?.start_date) },
      { label: strings.total_days_from_start, value: days },
      { label: strings.leave_count, value: sumBy(leaves, o => parseFloat(o.count)) },
      { label: strings.total_labour, value: days - sumBy(leaves, o => parseFloat(o.count)) },
      { label: strings.labour_rate, value: currencyFormat(data?.labour_rate) },
      { label: strings.total_labour_amount, value: currencyFormat(total_labour_amount) },
      { label: strings.given_amount, value: currencyFormat(given_amount) },
      {
        label: strings.final,
        value: currencyFormat(final_amount),
        color: final_amount < 0 ? "red" : "green",
      }
    ].map(item => `
          <div class="flex-container${item.color ? `" style="color:${item.color}"` : ''}">
            <h3>${item.label}:</h3>
            <h3>${item.value}</h3>
          </div>
        `).join('')}
      </div>

      <h2 style="padding-top:50px">${strings.leaves}</h2>
      <table style="width:100%">
        <tr>
          <th>${strings.date}</th>
          <th>${strings.leave}</th>
          <th>${strings.remark}</th>
        </tr>
        ${leaves.map(record => `
          <tr>
            <td>${dateFormat(record.date)}</td>
            <td>${record?.count}</td>
            <td width="20%">${record.detail}</td>
          </tr>
        `).join('')}
      </table>

      <h2 style="padding-top:50px">${strings.given_amount}</h2>
      <table style="width:100%">
        <tr>
          <th>${strings.date}</th>
          <th>${strings.amount}</th>
          <th>${strings.remark}</th>
        </tr>
        ${expense.map(record => `
          <tr>
            <td>${dateFormat(record.date)}</td>
            <td>${currencyFormat(record?.amount)}</td>
            <td>${record?.detail}</td>
          </tr>
        `).join('')}
      </table>
    </body>
  </html>`;
}
