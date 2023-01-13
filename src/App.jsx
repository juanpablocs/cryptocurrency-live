import './App.css';
import { AreaInfo, TickerList, TopBar } from './components';


function App() {
  return (
    <div className="App">
      <div className="App__top">
        <TopBar />
      </div>
      <div className="App__area">
        <AreaInfo />
      </div>
      <div className="App__sidebar">
        <TickerList />
      </div>
    </div>
  )
}

export default App
