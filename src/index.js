import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';
import "./App.css";
import { Provider } from 'react-redux';
import store from './reduxToolkit/store';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
    <ToastContainer/>
    <RouterProvider router={routes}/>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
