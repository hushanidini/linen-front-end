import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from "./pages/App";
import {Provider} from 'react-redux';
import store ,{persistor} from "./store";
import {PersistGate} from 'redux-persist/integration/react';
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null}  persistor={persistor}>
            <ThemeProvider theme={theme}>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
            </ThemeProvider>
        </PersistGate>
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
