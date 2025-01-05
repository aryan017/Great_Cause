import './App.css';
import React from 'react';
import {BrowserRouter as Router,Route,Link,Routes} from "react-router-dom";
import Home from './pages/Home';
import './index.css';
import CreateCampaign from './pages/CreateCampaign';

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
        <Link to="/">Home</Link>
        <Link to="/create">Create Campaign</Link>
        </nav>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/create' element={<CreateCampaign/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
