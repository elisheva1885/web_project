import { configureStore } from '@reduxjs/toolkit';
import './App.css';
import Branches from './Components/Branch';
import Home from './Components/Home';
import Overheads from './Components/air-conditioners/Overheads';

const myStore = configureStore({
  reducer:{
    tokenSlice
  }
})

function App() {
  return (
    <Provider store={myStore}>
      <div className="App">
        <Home />
      </div>
    </Provider>

  );
}

export default App;
