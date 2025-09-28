import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Home from './Home';
import Friends from './Friends';
import User from './User';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/profile" element={<User />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
