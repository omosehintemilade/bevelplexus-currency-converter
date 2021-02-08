import React, { useReducer, useContext } from "react";
import TransactionReducer from "./transactionReducer";
import TransactionContext from "./transactionContext";

import AlertContext from "../alert/alertContext";

import { useApolloClient } from "@apollo/client";
import { queries as gql } from "./gqlQueries";

import { GET_TRANSACTIONS, CHANGE_PAGE } from "../types";

const TransactionState = (props) => {
  const defaultState = {
    page: {
      offset: 0,
      limit: 5
    },
    transactions: []
  };

  const [state, dispatch] = useReducer(TransactionReducer, defaultState);
  const alertContext = useContext(AlertContext)
  const client = useApolloClient();

  // get all transactions
  const getTransactions = (page) => {
    client
      .query({
        query: gql.GET_ALL_TRANSACTIONS,
        fetchPolicy: "cache-first",
        variables: {
          offset: page.offset,
          limit: page.limit
        }
      })
      .then((res) => {
        dispatch({
          type: GET_TRANSACTIONS,
          payload: res.data.getTransactionByUser
        })
      })
      .catch((err) => {
        console.log(err);

        alertContext.showAlert({
          type: "error",
          title: "Opps!",
          body: "Failed to fetch transactions, please try again",
          action() {
            alertContext.hideAlert()
          }
        });
      });
  };

  const changePage = (page) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: page
    })

    getTransactions(page)
  }

  return (
    <TransactionContext.Provider
      value={{
        state,
        getTransactions,
        changePage
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
