import { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import PaymentCallback from './pages/PaymentCallback';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import {Toaster} from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import Contact from './pages/Contact';

function App() {


    const isOwnerPath = useLocation().pathname.includes("owner");
    const {showHotelReg} = useAppContext();
  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg /> } 

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path = '/' element= {<Home/>}/>
          <Route path = '/rooms' element= {<AllRooms/>}/>
          <Route path = '/rooms/:id' element= {<RoomDetails/>}/>
          <Route path = '/my-bookings' element= {<MyBookings/>}/>
          <Route path = '/payment/callback' element= {<PaymentCallback/>}/>
          <Route path = '/owner' element={<Layout/>}>

          <Route index element = {<Dashboard/>} />
          <Route path="add-room"  element = {<AddRoom/>} />
          <Route path="list-room" element = {<ListRoom/>} />

          </Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<Contact />} />

        </Routes>

      </div>
      <Footer />
    </div>
  )
}

export default App
