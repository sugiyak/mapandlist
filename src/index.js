import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './home';
import reportWebVitals from './reportWebVitals';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import react-ga
import ReactGA from 'react-ga';

// Initialize react-ga
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

// Function to track pageviews
const trackPageView = (url) => {
  ReactGA.pageview(url);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
     <Home trackPageView={trackPageView} />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

