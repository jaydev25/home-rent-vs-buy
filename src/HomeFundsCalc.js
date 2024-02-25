import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Value of your money overtime time',
    },
  },
  scales: {
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return convertToSimplifiedForm(value, 1);
        },
      },
    },
  },
};

function convertToSimplifiedForm(num, decimals) {
  if (num < 10000) {
    return num.toString();
  } else if (num < 100000) {
    return (num / 1000).toFixed(decimals) + 'K';
  } else if (num < 10000000) {
    return (num / 100000).toFixed(decimals) + 'L';
  } else if (num < 1000000000) {
    return (num / 10000000).toFixed(decimals) + 'CR';
  } else {
    return (num / 10000000).toFixed(decimals) + 'CR';
  }
}

function HomeLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(8000000);
  const [interestRate, setInterestRate] = useState(8.55);
  const [loanTerm, setLoanTerm] = useState(20);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [sipRate, setSipRate] = useState(12);
  const [homeRate, setHomeRate] = useState(3);
  const [rentRate, setRentRate] = useState(7);

  const [expenseValue, setExpenseValue] = useState({
    home: 0,
    rental: 0,
    MF: 0,
    homeValue: 0,
  });

  const [dataSet, setDataSet] = useState(null);

  const handleCalculate = () => {
    let currentDate = new Date();
    let principal = parseFloat(loanAmount);
    let rent = parseFloat(monthlyRent);
    const rate = parseFloat(interestRate) / 100 / 12; // monthly interest rate
    const term = parseFloat(loanTerm) * 12; // loan term in months
    let home = 0,
      rental = 0,
      MF = 0,
      homeValue = loanAmount;
    const monthlyPayment = (principal * rate) / (1 - Math.pow(1 + rate, -term));
    const monthlyInterestRate = sipRate / 12 / 100;
    const homeRateValue = homeRate / 100;
    const rentRateValue = rentRate / 100;
    const payments = [];

    for (let i = 1; i <= term; i++) {
      const interestPayment = principal * rate;
      const principalPayment = monthlyPayment - interestPayment;

      principal -= principalPayment;

      if (i % 13 === 0) {
        rent *= 1 + rentRateValue;
        homeValue *= 1 + homeRateValue;
      }

      currentDate = new Date(currentDate).setMonth(new Date(currentDate).getMonth() + 1);

      const diff = monthlyPayment - rent;

      MF += diff;

      MF *= 1 + monthlyInterestRate;
      home += monthlyPayment;
      rental += rent;

      payments.push({
        currentYear: new Date(currentDate).getFullYear(),
        month: i,
        principalPayment: principalPayment.toFixed(0),
        interestPayment: interestPayment.toFixed(0),
        remainingPrincipal: principal.toFixed(0),
        totalPayment: monthlyPayment.toFixed(0),
        rentPayment: rent.toFixed(0),
        differenceAmount: (monthlyPayment - rent).toFixed(0),
        mutualFundsAmount: MF.toFixed(0),
        homeValue: homeValue.toFixed(0),
        homeCoast: home.toFixed(0),
      });
    }

    setExpenseValue({ home, rental, MF, homeValue });

    setMonthlyPayments(payments);

    setDataSet({
      labels: payments.map((payment) => payment.currentYear),
      datasets: [
        {
          label: 'Home Value',
          data: payments.map((payment) => payment.homeValue),
          borderColor: '#D6EAF8',
          backgroundColor: '#D6EAF8',
        },
        {
          label: 'Mutual Funds Value',
          data: payments.map((payment) => payment.mutualFundsAmount),
          borderColor: '#E8DAEF',
          backgroundColor: '#E8DAEF',
        },
        {
          label: 'Money Spent',
          data: payments.map((payment) => payment.homeCoast),
          borderColor: '#D5F5E3',
          backgroundColor: '#D5F5E3',
        },
      ],
    });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2>Rent VS Buy Calculator</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, width: '100%' }}>
          <table border="1px" style={{ display: 'table', width: '100%' }}>
            <tbody>
              <tr style={{ backgroundColor: '#989898' }}>
                <td colSpan={2}>In case of buying</td>
              </tr>
              <tr style={{ backgroundColor: '#D5F5E3' }}>
                <td>
                  {' '}
                  <label>Loan Amount:</label>
                </td>
                <td>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Interest Rate (%):</label>
                </td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Loan Term (Years):</label>
                </td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Property appreciation rate % pa:</label>
                </td>
                <td>
                  <input
                    type="number"
                    value={homeRate}
                    onChange={(e) => setHomeRate(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: '#989898' }}>
                <td colSpan={2}>In case of renting</td>
              </tr>
              <tr style={{ backgroundColor: '#FDEBD0' }}>
                <td>
                  <label>Probable rent of the house you want to own?:</label>
                </td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>By how much will the rent go up annually % pa:</label>
                </td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={rentRate}
                    onChange={(e) => setRentRate(Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: '#E8DAEF' }}>
                <td>
                  <label>SIP returns % pa:</label>
                </td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={sipRate}
                    onChange={(e) => setSipRate(Number(e.target.value))}
                  />
                </td>
              </tr>
              
              <tr>
                <td colSpan={2}>
                  <button
                    onClick={handleCalculate}
                    style={{
                      height: '50px',
                      cursor: 'pointer',
                      width: '100%',
                      backgroundColor: '#D6EAF8',
                    }}
                  >
                    Calculate
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ flex: 1, width: '100%' }}>
          <Line
            options={options}
            data={dataSet || { labels: [], datasets: [] }}
          />
        </div>
      </div>

      <br />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, width: '100%' }}>
          <p style={{ backgroundColor: '#D5F5E3' }}>
            Total Home Coast:{' '}
            <NumericFormat
              value={expenseValue.home.toFixed(0)}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'₹'}
            />{' '}
            ({convertToSimplifiedForm(expenseValue.home.toFixed(0), 3)})
          </p>
          <p style={{ backgroundColor: '#FDEBD0' }}>
            Total Rent Coast:{' '}
            <NumericFormat
              value={expenseValue.rental.toFixed(0)}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'₹'}
            />{' '}
            ({convertToSimplifiedForm(expenseValue.rental.toFixed(0), 3)})
          </p>
          <p style={{ backgroundColor: '#E8DAEF' }}>
            Rent VS EMI Difference Mutualfunds returns:{' '}
            <NumericFormat
              value={expenseValue.MF.toFixed(0)}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'₹'}
            />{' '}
            ({convertToSimplifiedForm(expenseValue.MF.toFixed(0), 3)})
          </p>
          <p style={{ backgroundColor: '#D6EAF8' }}>
            Home Value:{' '}
            <NumericFormat
              value={expenseValue.homeValue.toFixed(0)}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'₹'}
            />{' '}
            ({convertToSimplifiedForm(expenseValue.homeValue.toFixed(0), 3)})
          </p>
        </div>
        <div style={{ flex: 1, width: '100%', overflow: 'scroll' }}>
          <table border="1px" style={{ display: 'table', width: '100%' }}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Principal Payment</th>
                <th>Interest Payment</th>
                <th style={{ backgroundColor: '#D5F5E3' }}>Total Payment</th>
                <th style={{ backgroundColor: '#FDEBD0' }}>
                  Monthly Rent Payment
                </th>
                <th>Monthly Rent VS EMI Difference</th>
                <th style={{ backgroundColor: '#E8DAEF' }}>Mutual Funds Sum</th>
                <th style={{ backgroundColor: '#D6EAF8' }}>Home Value</th>
                <th>Remaining Principal</th>
              </tr>
            </thead>
            <tbody>
              {monthlyPayments.map((payment) => (
                <tr key={payment.month}>
                  <td>
                    {payment.month}
                  </td>
                  <td>
                    <NumericFormat
                      value={payment.principalPayment}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td>
                    <NumericFormat
                      value={payment.interestPayment}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td style={{ backgroundColor: '#D5F5E3' }}>
                    <NumericFormat
                      value={payment.totalPayment}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td style={{ backgroundColor: '#FDEBD0' }}>
                    <NumericFormat
                      value={payment.rentPayment}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td>
                    <NumericFormat
                      value={payment.differenceAmount}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td style={{ backgroundColor: '#E8DAEF' }}>
                    <NumericFormat
                      value={payment.mutualFundsAmount}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td style={{ backgroundColor: '#D6EAF8' }}>
                    <NumericFormat
                      value={payment.homeValue}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                  <td>
                    <NumericFormat
                      value={payment.remainingPrincipal}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'₹'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HomeLoanCalculator;
