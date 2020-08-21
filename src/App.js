import React from 'react';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'
// import Index from '../src/pages/index/index'
import Home from './pages/Home/index'
import CityList from './pages/citylist/index'
import HouseDetail from './pages/HouseDetail'
import Map from './pages/Map'
function App() {
  return (
  <Router>
    <div className='App'>
      
        <Route path='/' exact render={()=> <Redirect to='/home' />} />
        <Route path='/home' component={Home}/>
        <Route path='/citylist' component={CityList}/>
        <Route path='/detail/:id' component={HouseDetail}></Route>
        <Route path='/map' component={Map}></Route>
    </div>
  </Router>
    
   
  )
}

export default App;
