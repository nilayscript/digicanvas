import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { createStore } from 'polotno/model/store';
import { unstable_setAnimationsEnabled } from 'polotno/config';
import { Auth0Provider } from '@auth0/auth0-react';
import { createProject, ProjectContext } from './project';

import './index.css';
import App from './App';
import './logger';
import { ErrorBoundary } from 'react-error-boundary';
import { store as reduxStore } from './redux/app/store';

unstable_setAnimationsEnabled(true);

const store = createStore({ key: 'nFA5H9elEytDyPyvKL7T' });
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

const root = ReactDOM.createRoot(document.getElementById('root'));

const AUTH_DOMAIN = 'polotno-studio.eu.auth0.com';
const PRODUCTION_ID = process.env.REACT_APP_AUTH0_ID;
const LOCAL_ID = process.env.REACT_APP_AUTH0_ID;

const isLocalhost =
  typeof window !== undefined && window.location.href.indexOf('localhost') >= 0;
const ID = isLocalhost ? LOCAL_ID : PRODUCTION_ID;
const REDIRECT = isLocalhost
  ? 'http://localhost:3000'
  : 'https://studio.polotno.com';


function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <p>Something went wrong in the app.</p>
        <p>Try to reload the page.</p>
        <p>If it does not work, clear cache and reload.</p>
        <button
          onClick={async () => {
            await project.clear();
            window.location.reload();
          }}
        >
          Clear cache and reload
        </button>
      </div>
    </div>
  );
}

root.render(
  <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {
      // Reset the state of your app so the error doesn't happen again
    }}
    onError={(e) => {
      if (window.Sentry) {
        window.Sentry.captureException(e);
      }
    }}
  >
    <Provider store={reduxStore}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#454D59',
            colorLink: '#454D59',
            fontFamily: 'Inter',
            colorTextPlaceholder: '#abb3bf',
          },
          components: {
            Select: {
              colorBgContainer: '#454D59',
              colorBorder: 'transparent',
              colorText: '#fff',
              optionSelectedBg: '#454D59',
              optionSelectedColor: '#fff',
            },
            Input: {
              colorBgContainer: '#454D59',
              colorBorder: 'transparent',
              colorText: '#fff',
            },
            InputNumber: {
              colorBgContainer: '#454D59',
              colorBorder: 'transparent',
              colorText: '#fff',
            },
            Button: {
              colorBorder: 'transparent',
              colorText: '#fff',
            },
            DatePicker: {
              colorBgContainer: '#454D59',
              colorBorder: 'transparent',
              colorText: '#fff',
            },
          },
        }}
      >
        <ProjectContext.Provider value={project}>
          <Auth0Provider domain={AUTH_DOMAIN} clientId={ID} redirectUri={REDIRECT}>
            <App store={store} />
          </Auth0Provider>
        </ProjectContext.Provider>
      </ConfigProvider>
    </Provider>
  </ErrorBoundary>
);
