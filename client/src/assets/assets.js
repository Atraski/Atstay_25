import logo from './logo.webp';
import closeIcon from './Icons/closeIcon.svg';
import menuIcon from './Icons/menuIcon.svg';
import searchIcon from './Icons/searchIcon.svg';
import heroImage from './heroImage.jpg';
import herooImage from './herooImage.jpg';
import starIconFilled from './Icons/starIconFilled.svg';
import locationIcon from './Icons/locationIcon.svg';
import Bhimkothi_1 from './Bhimkothi/Bhimkothi_1.jpg';
import Bhimkothi_2 from './Bhimkothi/Bhimkothi_2.jpg';
import Bhimkothi_3 from './Bhimkothi/Bhimkothi_3.jpg';
import Bhimkothi_4 from './Bhimkothi/Bhimkothi_4.jpg';
import arrowIcon from './Icons/arrowIcon.svg';
import exclusiveOfferCardImg1 from './exclusiveOfferCardImg1.png';
import exclusiveOfferCardImg2 from './exclusiveOfferCardImg2.png';
import exclusiveOfferCardImg3 from './exclusiveOfferCardImg3.png';
import starIconOutlined from './Icons/starIconOutlined.svg';
import customer_1 from './customer_1.jpg';
import instagramIcon from './Icons/instagramIcon.svg'
import facebookIcon from './Icons/facebookIcon.svg'
import twitterIcon from './Icons/twitterIcon.svg'
import linkendinIcon from './Icons/linkendinIcon.svg'
import freeBreakfastIcon from './Icons/freeBreakfastIcon.svg';
import freeWifiIcon from './Icons/freeWifiIcon.svg';
import roomServiceIcon from './Icons/roomServiceIcon.svg';
import mountainIcon from './Icons/mountainIcon.svg';
import poolIcon from './Icons/poolIcon.svg';
import guestsIcon from './Icons/guestsIcon.svg';
import totalBookingIcon from './Icons/totalBookingIcon.svg';
import totalRevenueIcon from './Icons/totalRevenueIcon.svg';
import mowgli_1 from './Mowgli/Mowgli_1.jpg';
import mowgli_2 from './Mowgli/Mowgli_2.jpg';
import mowgli_3 from './Mowgli/Mowgli_3.jpg';
import mowgli_4 from './Mowgli/Mowgli_4.jpg';
import Shimla_Hills_1 from './Shimla_Hills/Shimla_Hills_1.jpg';
import Shimla_Hills_2 from './Shimla_Hills/Shimla Hills_2.jpg';
import Shimla_Hills_3 from './Shimla_Hills/Shimla_Hills_3.jpg';
import Shimla_Hills_4 from './Shimla_Hills/Shimla_Hills_4.jpg';
import regImage from './regImage.png';
import dashboardIcon from './Icons/dashboardIcon.svg'
import addIcon from './Icons/addIcon.svg'
import listIcon from './Icons/listIcon.svg'
import uploadArea from './Icons/uploadArea.svg'
import homeIcon from './Icons/homeIcon.svg';
import badgeIcon from './Icons/badgeIcon.svg'
import locationFilledIcon from './Icons/locationFilledIcon.svg';
import heartIcon from './Icons/heartIcon.svg';

export const assets = {
    logo,
    closeIcon,
    menuIcon,
    searchIcon,
    heroImage,
    herooImage,
    starIconFilled,
    locationIcon,
    Bhimkothi_1,
    Bhimkothi_2,
    Bhimkothi_3,
    Bhimkothi_4,
    arrowIcon,
    exclusiveOfferCardImg1,
    exclusiveOfferCardImg2,
    exclusiveOfferCardImg3,
    starIconOutlined,
    customer_1,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeBreakfastIcon,
    freeWifiIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    guestsIcon,
    totalBookingIcon,
    totalRevenueIcon,
    mowgli_1,
    mowgli_2,
    mowgli_3,
    mowgli_4,
    Shimla_Hills_1,
    Shimla_Hills_2,
    Shimla_Hills_3,
    Shimla_Hills_4,
    regImage,
    dashboardIcon,
    addIcon,
    listIcon,
    uploadArea,
    homeIcon,
    badgeIcon,
    locationFilledIcon,
    heartIcon,
};

export const cities = [
    "Rishikesh",
    "Spiti",
    "Varanasi",
    "Goa",
    "Manali",
    "Jaisalmer",
    "Jodhpur",
    "Nainital",
    "Shillong",
    "Shimla",
    "Rudraprayag"

];

// Exclusive Offers Dummy Data
export const exclusiveOffers = [
    { _id: 1, title: "Summer Escape Package", description: "Enjoy a complimentary night and daily breakfast", priceOff: 25, expiryDate: "Aug 31", image: exclusiveOfferCardImg1 },
    { _id: 2, title: "Romantic Gateway", description: "Special couples package including spa treatment", priceOff: 20, expiryDate: "Sep 20", image: exclusiveOfferCardImg2 },
    { _id: 3, title: "Luxury Retreat", description: "Book 60 days in advance and save on your stay at any of our luxury properties worldwide.", priceOff: 30, expiryDate: "Sep 25", image: exclusiveOfferCardImg3 },
]

// Testimonials Dummy Data
export const testimonials = [
    { id: 1, name: "Sandeep Maity", address: "Kolkata", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that AtStay provides." },
    { id: 2, name: "Manish Chauhan", address: "Nainital", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "AtStay exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!" },
    { id: 3, name: "Premlee Ghartee", address: "Spitti", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "Amazing service! I always find the best luxury accommodations through AtStay. Their recommendations never disappoint!" }
];

// Facility Icon
export const facilityIcons = {
    "Free WiFi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
};




// User Dummy Data
export const userDummyData = {
    "_id": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Pawan",
    "email": "upawan7273@gmail.com",
    "image": "https://i.ibb.co/jPBNtj9c/CN3-JRy-Yk-amitjainhotelmanager-1-1200x757.jpg",
    "role": "hotelOwner",
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": [
        "Spiti",
    ]
}

// For Room Details Page
export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Cleaning", description: "This host follows Staybnb's strict cleaning standards." },
    { icon: assets.locationFilledIcon, title: "Excellent Location", description: "90% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Smooth Check-In", description: "100% of guests gave check-in a 5-star rating." },
];

// Hotel Dummy Data
export const hotelDummyData = {
    "_id": "67f76393197ac559e4089b72",
    "name": "Bhimkothi Boutique",
    "address": "Sadar Bazar, Mali para, Ram Kund, Jaisalmer, India, 345001",
    "contact": "+0123456789",
    "owner": userDummyData,
    "city": "Jaisalmer",
    "createdAt": "2025-04-10T06:22:11.663Z",
    "updatedAt": "2025-04-10T06:22:11.663Z",
    "__v": 0
}

// Rooms Dummy Data
export const roomsDummyData = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "hotel": hotelDummyData,
        "roomType": "Double Bed",
        "pricePerNight": 2217,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [Bhimkothi_1, Bhimkothi_2, Bhimkothi_3, Bhimkothi_4],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
     {
         "_id": "67f76452197ac559e4089b8e",
         "hotel": hotelDummyData,
         "roomType": "Double Bed",
         "pricePerNight": 299,
         "amenities": ["Room Service", "Mountain View", "Pool Access"],
         "images": [mowgli_1, mowgli_2, mowgli_3, mowgli_4],
         "isAvailable": true,
         "createdAt": "2025-04-10T06:25:22.593Z",
         "updatedAt": "2025-04-10T06:25:22.593Z",
         "__v": 0
     },
     {
         "_id": "67f76406197ac559e4089b82",
         "hotel": hotelDummyData,
         "roomType": "Double Bed",
         "pricePerNight": 249,
         "amenities": ["Free WiFi", "Free Breakfast", "Room Service"],
         "images": [Shimla_Hills_1, Shimla_Hills_2, Shimla_Hills_3, Shimla_Hills_4],
         "isAvailable": true,
         "createdAt": "2025-04-10T06:24:06.285Z",
         "updatedAt": "2025-04-10T06:24:06.285Z",
         "__v": 0
     },

     {
         "_id": "67f763d8197ac559e4089b7a",
         "hotel": hotelDummyData,
         "roomType": "Single Bed",
         "pricePerNight": 199,
         "amenities": ["Free WiFi", "Room Service", "Pool Access"],
         "images": [Bhimkothi_1, Bhimkothi_2, Bhimkothi_3, Bhimkothi_4],
         "isAvailable": true,
         "createdAt": "2025-04-10T06:23:20.252Z",
         "updatedAt": "2025-04-10T06:23:20.252Z",
         "__v": 0
     },
]

// User Bookings Dummy Data
export const userBookingsDummyData = [
    {
        "_id": "67f76839994a731e97d3b8ce",
        "user": userDummyData,
        "room": roomsDummyData[1],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Stripe",
        "isPaid": true,
        "createdAt": "2025-04-10T06:42:01.529Z",
        "updatedAt": "2025-04-10T06:43:54.520Z",
        "__v": 0
    },
    {
        "_id": "67f76829994a731e97d3b8c3",
        "user": userDummyData,
        "room": roomsDummyData[0],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-27T00:00:00.000Z",
        "checkOutDate": "2025-04-28T00:00:00.000Z",
        "totalPrice": 399,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:45.873Z",
        "updatedAt": "2025-04-10T06:41:45.873Z",
        "__v": 0
    },
    {
        "_id": "67f76810994a731e97d3b8b4",
        "user": userDummyData,
        "room": roomsDummyData[3],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-11T00:00:00.000Z",
        "checkOutDate": "2025-04-12T00:00:00.000Z",
        "totalPrice": 199,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:20.501Z",
        "updatedAt": "2025-04-10T06:41:20.501Z",
        "__v": 0
    }
]

// Dashboard Dummy Data
export const dashboardDummyData = {
    "totalBookings": 3,
    "totalRevenue": 897,
    "bookings": userBookingsDummyData
}

