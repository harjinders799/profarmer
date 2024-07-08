import moment from 'moment';
import { sortBy } from 'lodash';
import { currencyFormat, dateFormat, dayCount } from '@utils/dateformat';
import { getInterest } from '@utils/helper';

export function aadhatHTMLFormat(strings, user, data) {
  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          table, th, td {
            border: 1px solid black;
          border-collapse: collapse;
          padding:10px;
          }
          td {
            text - align: center;
          }
            .card {
            width: 48%; /* Set card width to 45% */
            color: white;
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow for depth */
            padding: 16px; /* Padding inside the card */
          }
        </style>
      </head>
      <body>
        <div style="display: flex; flex-direction:column; align-items:center">
          <div style="display: flex; justify-content: space-between; width:100%">
            <div>
              <h2>${strings.farmer_name}: ${user?.name}</h2>
              <p>${user?.phone}</p>
              <p>${user?.email ?? ''}</p>
            </div>
            <div>
              <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
              <p>${moment().format('lll')}</p>
            </div>
          </div>
          <h2>${data?.name}</h2>
          <div>
            <h3>${strings.interest}: ${currencyFormat(
    data?.interest_rate,
  )} </h3>
          </div>
        </div>
        <div style="display: flex; gap: 16px; justify-content: space-between;">
          <div class="card" style="background-color:#d63122;">
            <h1>${strings.taken_amount}</h1>
            <h3>${strings.taken_amount}: ${currencyFormat(
    data?.totalReceivedAmount,
    2,
  )} </h3>
            <h3>${strings.interest}: ${currencyFormat(
    data?.totalReceivedAmountInterest,
    2,
  )} </h3>
            <h3>${strings.taken_amount_with_interest}: ${currencyFormat(
    data?.totalReceivedAmountWithInterest,
    2,
  )}
            </h3>
          </div>
          <div class="card" style="background-color:#4CA15f;">
             <h1>${strings.given_amount}</h1>
            <h3>${strings.given_amount}: ${currencyFormat(
    data?.totalGivenAmount,
    2,
  )} </h3>
            <h3>${strings.interest}: ${currencyFormat(
    data?.totalGivenAmountInterest,
    2,
  )} </h3>
            <h3>${strings.given_amount_with_interest}: ${currencyFormat(
    data?.totalGivenAmountWithInterest,
    2,
  )}
          </div>
        </div>
        <div style="display: flex; justify-content: space-around; margin: 0 10%; color: #FFA500;">
            <h2>${strings.final}</h3>
            <h5> ${data?.finalAmount == 0
      ? '---'
      : data?.finalAmount > 0
        ? strings.receive
        : strings.give
    }</h6>
            <h2>${currencyFormat(data?.finalAmount)}</h3>
        </div>

        <h2>${strings.aadhatiya_hisab}</h2>
        <table style="width:100%">
          <tr>
            <th>${strings.date}</th>
            <th>${strings.day}</th>
            <th>${strings.total_interest}</th>
            <th>${strings.taken_amount}</th>
            <th>${strings.total_amount}</th>
            <th>${strings.remark}</th>
          </tr>
          ${sortBy(
      data?.transactions,
      (a, b) => moment(b?.date) - moment(a?.date),
    )
      .map(record => {
        let days = dayCount(record?.date);
        let interest = getInterest([
          { ...record, interest_rate: data?.interest_rate },
        ]);

        return record?.type == 'receiver'
          ? `<tr>
                <td>${dateFormat(record.date)}</td>
                <td>${days}</td>
                <td>${currencyFormat(interest)}</td>
                 <td>${currencyFormat(record?.amount)}</td>
                <td>${currencyFormat(
            parseFloat(interest) + parseFloat(record?.amount),
          )}</td>
                <td>${record?.detail}</td>
            </tr>`
          : null;
      })
      .join('')}
        </table>

        <h2>${strings.crop / strings.given_amount}</h2>
        <table style="width:100%">
          <tr>
            <th>${strings.date}</th>
            <th>${strings.crop}</th>
            <th>${strings.day}</th>
            <th>${strings.total_interest}</th>
            <th>${strings.given_amount}</th>
            <th>${strings.total_amount}</th>
            <th>${strings.remark}</th>
          </tr>
          ${sortBy(
        data?.transactions,
        (a, b) => moment(b?.date) - moment(a?.date),
      )
      .map(record => {
        let days = dayCount(record?.date);
        let interest = getInterest([
          { ...record, interest_rate: data?.interest_rate },
        ]);

        return record?.type == 'giver'
          ? `<tr>
                <td>${dateFormat(record.date)}</td>
                <td>${record?.crop
            ? `${record?.crop}\n${record?.weight}Qtl ${currencyFormat(
              record?.rate,
            )}`
            : '--'
          }</td>
                <td>${days}</td>
                <td>${currencyFormat(interest)}</td>
                 <td>${currencyFormat(record?.amount)}</td>
                <td>${currencyFormat(
            parseFloat(interest) + parseFloat(record?.amount),
          )}</td>
                <td>${record?.detail}</td>
            </tr>`
          : null;
      })
      .join('')}
        </table>
      </body>
    </html>
    `;
}
