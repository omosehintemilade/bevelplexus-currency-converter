import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./CurrencyCalc.scss";

import PaymentContext from "../../context/payment/paymentContext";

import { Menu, Dropdown } from "antd";

const CurrencyCalc = () => {
  const [tempValue, setTempValue] = useState("")
  const paymentContext = useContext(PaymentContext);

  const {
    sendCurrency,
    baseAmount,
    destinationCurrency,
    convertedAmount,
    actualAmount,
    fee,
    rate,
    receiveType,
    reverse,
  } = paymentContext.state.fxDetails;

  const handleClick = (e, name) => {
    const data = {
      sendCurrency: name === "sendCurrency" ? e.key : sendCurrency,
      destinationCurrency: name === "destinationCurrency" ? e.key : destinationCurrency,
      baseAmount,
      convertedAmount: baseAmount === "" ? "" : convertedAmount,
      receiveType,
      reverse: reverse,
    };

    paymentContext.getFxRates(data);
  };

  const handleChange = (e) => {

    if (e.target.name === "convertedAmount") {
      paymentContext.setReverseCalc(true);
      sendFxRateRequest(e, true);
    } else {
      paymentContext.setReverseCalc(false);
      sendFxRateRequest(e, false);
    }

    setTempValue(e.target.value)
  };

  const sendFxRateRequest = (e, calcType) => {
    const data = {
      sendCurrency,
      destinationCurrency,
      baseAmount: reverse === true ? "" : parseFloat(e.target.value) || "",
      convertedAmount:
        reverse === false ? "" : parseFloat(e.target.value) || "",
      actualAmount: baseAmount === "" ? 0 : actualAmount,
      fee: baseAmount === "" ? 0 : fee,
      rate: baseAmount === "" ? 0 : rate,
      receiveType: receiveType,
      reverse: calcType,
    };

    paymentContext.getFxRates(data);
  };

  const addFlagsToCountries = () => {
    const countries = paymentContext.state.countries;

    const withFlags = countries.map((ct) => {
      const flagCode = ct.countryCode.slice(0, 2).toLowerCase();

      return {
        ...ct,
        flag: `https://www.countryflags.io/${flagCode}/flat/24.png`,
      };
    });

    return withFlags;
  };

  const currencies = addFlagsToCountries();

  const sendCurrencyMenu = (
    <Menu
      onClick={(e) => handleClick(e, "sendCurrency")}
      name='sendCurrency'
      selectedKeys={sendCurrency}
    >
      {currencies.map((currency) => (
        <Menu.Item key={currency.currencyCode}>
          <img src={currency.flag} alt={currency.currencyCode} />{" "}
          {currency.currencyCode}
        </Menu.Item>
      ))}
    </Menu>
  );

  const receiveCurrencyMenu = (
    <Menu
      onClick={(e) => handleClick(e, "destinationCurrency")}
      selectedKeys={destinationCurrency}
    >
      {currencies.map((currency) => (
        <Menu.Item key={currency.currencyCode}>
          <img src={currency.flag} alt={currency.currencyCode} />{" "}
          {currency.currencyCode}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div id='currency-calculator'>
      <form>
        <label>
          <div className='currency-input'>
            <small>You Send</small>
            <input
              type='number'
              name='baseAmount'
              placeholder='1,000'
              value={reverse === false ? tempValue : baseAmount}
              onChange={handleChange}
              onKeyUp={handleChange}
            />
          </div>

          <Dropdown overlay={sendCurrencyMenu}>
            <p className='currency-dropdown'>
              <img
                src={`https://www.countryflags.io/${sendCurrency
                  .slice(0, 2)
                  .toLowerCase()}/flat/24.png`}
                alt={sendCurrency}
              />
              {sendCurrency}
              <span className='material-icons'>arrow_drop_down</span>
            </p>
          </Dropdown>
        </label>

        <div className='logic-box'>
          <p>
            <span className='logic__symbols'>
              <small>–</small>
            </span>{" "}
            {fee} {sendCurrency}
            <span className='logic__description'>Fee (Including IOF)</span>
          </p>
          <p>
            <span className='logic__symbols'>
              <small>=</small>
            </span>{" "}
            {actualAmount} {sendCurrency}
            <span className='logic__description'>Amount we'll convert</span>
          </p>
          <p>
            <span className='logic__symbols'>
              <small>÷</small>
            </span>{" "}
            {rate}
            <span className='logic__description'>
              Commercial rate (144 hrs)
            </span>
          </p>
        </div>

        <label>
          <div className='currency-input'>
            <small>They Receive</small>
            <input
              type='number'
              name='convertedAmount'
              placeholder='3,900'
              value={reverse === true ? tempValue : convertedAmount}
              onChange={handleChange}
              onKeyUp={handleChange}
              // disabled
            />
          </div>

          <Dropdown overlay={receiveCurrencyMenu}>
            <p className='currency-dropdown'>
              <img
                src={`https://www.countryflags.io/${destinationCurrency
                  .slice(0, 2)
                  .toLowerCase()}/flat/24.png`}
                alt={destinationCurrency}
              />
              {destinationCurrency}
              <span className='material-icons'>arrow_drop_down</span>
            </p>
          </Dropdown>
        </label>

        <div className='notice'>
          <p>This page is refreshed every 60 seconds</p>
        </div>

        <div className='form__submit'>
          <Link to='/dashboard/recipient'>
            <button type='button' className='form__submit__button'>
              Send this Amount
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CurrencyCalc;
