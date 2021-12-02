import React from 'react';
import './App.css';
import "antd/dist/antd.css";
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/Home';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from "./AdminRoute";
import AdminPage from './components/AdminPage/AdminPage';
import UserPage from './components/UserPage/UserPage';
import UserRoute from "./UserRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className='App'>
                    <Route exact path='/' component={Home} />
                    <AdminRoute path='/adminPage' component={AdminPage} />
                    <UserRoute path='/userPage' component={UserPage} />
                </div>
            </Router>
        </AuthProvider>
  );
}

export default App;
