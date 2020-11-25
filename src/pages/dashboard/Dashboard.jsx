import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import "./Dashboard.scss";

import Layout from "../../components/layout/LayoutAlt";
import TransactionTable from '../../components/tables/TransactionsTable'

import TransactionContext from '../../context/transactions/transactionContext'

function Dashboard({showTips}) {

  const transactionContext = useContext(TransactionContext);

  // const [total, setTotal] = useState(0);

  const total = () => {
    let amount = 0;

    transactionContext.state.transactions.forEach(item => {
      amount += item.baseAmount
    });

    return amount
  }

  return (
    <div id='dashboard'>
      <Layout currentMenu='dashboard' showTips={showTips}>
        <div className='page-title'>
          <h1>DASHBOARD</h1>
        </div>

        <div className='shadow-box box-one'>
          <div className='box-one__title'>
            <h2>Send Again</h2>
          </div>

          <div className='box-one__content'>
            <div className='user-details'>
              <div className='user-details__avi'>
                <img src='/assets/img/avatar-square.png' alt='avi' />
                <img src="/assets/svg/brazil-flag.svg" alt="" className="user-details__avi__flag"/>
              </div>
              <span className='box-one__text-wrapper'>
                <h3>Phillip Mango</h3>
                <p>phillipmango@email.com</p>
              </span>
            </div>

            <div className="box-one__text-wrapper alt">
              <h3>
                <span>1000 CAD</span>
                <span className='material-icons'>arrow_right</span>
                <span>3900 BRL</span>
              </h3>
              <p>Last Transaction</p>
            </div>

            <div className="box-one__cta">
              <Link to='/payment'><button>Send Money</button></Link>
            </div>
          </div>
        </div>

        <div className="box-container double-box-container">
          {/* <div className="shadow-box box-two">
            <div className="icon-container">
              <img src="/assets/svg/wallet-icon-alt.svg" alt="walllet"/>
            </div>

            <div className="box-two__text-wrapper">
              <p>AVAILABLE CREDIT</p>
              <h4>13,750.00 NGL</h4>
            </div>
          </div> */}

          <div className="shadow-box box-three" style={{width: "100%"}}>
            <div className="icon-container">
              <img src="/assets/svg/transaction-icon-alt.svg" alt="transaction"/>
            </div>

            <div className="box-three__text-wrapper">
              <p>TOTAL TRANSACTIONS</p>
              <h4>{total()} NGL</h4>
            </div>
          </div>
        </div>

        <div className="shadow-box box-four">
          <div className='box-four__title'>
            <h2>
              Recent Transactions
              <Link to='/transactions'>View All</Link>
            </h2>
          </div>

          <div className="box-one__content">
            <TransactionTable />
          </div>
        </div>

      </Layout>
    </div>
  );
}

export default Dashboard;
