//App.js
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Profile } from './components/Profile';
import { Shop } from './components/Shop';
import { RequireAuth } from './RequireAuth';
import { Login } from './components/Login';
import { Recommend } from './components/Recommend';
import { Home } from './components/Home';
import { Layout } from './components/Layout';

import {
  BrowserRouter,
  // Switch,
  Route,
  // Link,
  Routes
} from "react-router-dom";

import './App.css';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/recommend"
            element={
              <RequireAuth>
                <Recommend />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/shop_:id"
            element={
              <RequireAuth>
                <Shop />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Authenticator.Provider>
      <MyRoutes />
    </Authenticator.Provider>
  );
}

export default App;