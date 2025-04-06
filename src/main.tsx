import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider, App as AntdApp } from 'antd'
import { AppProvider } from './data/AppContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      token: {
        colorBgLayout: 'white',
      },
    }}>
      <AntdApp>
        <AppProvider>
          <App />
        </AppProvider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
