import moment from 'moment';
import { sortBy, sumBy } from 'lodash';
import { currencyFormat, dateFormat, dayCount } from '@utils/dateformat';


export function pickerGroupHTMLFormat(strings, user, picker, expenses, weights) {
  const totalWeight = sumBy(weights, o => parseFloat(o.weight));
  const totalAmount = sumBy(weights, o => parseFloat(o.weight) * parseFloat(o.rate));
  const totalGiven = sumBy(expenses, o => parseFloat(o.amount));
  const finalAmount = totalAmount - totalGiven;
  const finalClass = finalAmount < 0 ? 'final-amount-negative' : 'final-amount-positive';
  const amountLabel = finalAmount < 0 ? strings.receive : strings.give;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Picker Report</title>
<style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #fff;
    margin: 0;
    padding: 20px;
    color: #333;
  }

  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  h2, h3 {
    margin: 20px 0 5px 0;
    color: #333;
  }

  .total {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-weight: bold;
  }

  .total-weight,
  .total-amount,
  .given-amount {
    color: #333;
  }

  .final-amount-positive {
    color: #28a745;
  }

  .final-amount-negative {
    color: #dc3545;
  }

  .amount-label {
    font-size: 0.9em;
    margin-top: 5px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }

  .footer {
    text-align: center;
    margin-top: 20px;
    font-size: 0.9em;
    color: #555;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
      color: #000;
    }

    .container {
      border: none;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>    
        <h2>${strings.farmer_name}: ${user?.name}</h2>
        <p>${user?.phone}</p>
        <p>${user?.email}</p>
      </div>
      <div>
              <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
        <p>${moment().format('lll')}</p>
      </div>
    </div>

    <div>
      <h2>${strings.picker_name}: ${picker?.name}</h2>
      
      <div class="total">
        <span class="total-weight">${strings.total_weight}:</span>
        <span class="total-weight">${totalWeight} Kg</span>
      </div>

      <div class="total">
        <span class="total-amount">${strings.total_amount}:</span>
        <span class="total-amount">${currencyFormat(totalAmount)}</span>
      </div>

      <div class="total">
        <span class="given-amount">${strings.given_amount}:</span>
        <span class="given-amount">${currencyFormat(totalGiven)}</span>
      </div>

      <div class="total">
        <span>${strings.final}:</span>
        <p class="amount-label ${finalClass}">${amountLabel}</p>
        <span class="final-amount ${finalClass}">${currencyFormat(finalAmount)}</span>
      </div>
      
    </div>

    <h2>${strings.pickers_weight}</h2>
    <table>
      <tr>
        <th>${strings.date}</th>
        <th>${strings.enter_rate}</th>
        <th>${strings.weight}</th>
        <th>${strings.amount}</th>
        <th>${strings.remark}</th>
      </tr>
      ${weights.map(record =>
    `<tr>
          <td>${dateFormat(record?.date)}</td>
          <td>${currencyFormat(record?.rate)}</td>
          <td>${record?.weight} Kg</td>
          <td>${currencyFormat(record?.rate * record?.weight)}</td>
          <td>${record?.detail}</td>
        </tr>`).join('')}
    </table>

    <h2>${strings.pickers_amounts}</h2>
    <table>
      <tr>
        <th>${strings.date}</th>
        <th>${strings.amount}</th>
        <th>${strings.remark}</th>
      </tr>
      ${expenses.map(amount =>
      `<tr>
          <td>${dateFormat(amount?.date)}</td>
          <td>${currencyFormat(amount?.amount)}</td>
          <td>${amount?.detail}</td>
        </tr>`).join('')}
    </table>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Pro Farmer. All Rights Reserved.
    </div>
  </div>
</body>
</html>`;
}
