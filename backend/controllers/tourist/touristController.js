// Import userModel and other modules using ES module syntax
import userModel from '../../models/tourist.js';
import productModel from '../../models/product.js';
import { amadeus, getAccessToken } from '../../config/amadeus.js';
import axios from 'axios';

// Create a new tourist
const CreateTourist = async (req, res) => {
  const { username, email, password, mobile, nationality, DOB, job_Student/*, wallet*/ } = req.body;
  //const hashed = hashPassword(Password);

  try {
    // Check for existing user by username or email
    const existingTourist = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingTourist) {
      // Return an error if the user already exists
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Check age requirement
    const dobDate = new Date(DOB);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    const monthDiff = new Date().getMonth() - dobDate.getMonth();
    const isUnderage = age < 18 || (age === 18 && monthDiff < 0);

    // Create a new tourist
    const tourist = await userModel.create({ username, email, password, mobile, nationality, DOB, job_Student, underage: isUnderage });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/////////////////////////////////////////////////////////////////////

// Get all tourists
const getTourist = async (req, res) => {
  try {
    const tourist = await userModel.find();
    return res.status(200).send(tourist);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

// Get one tourist

const getOneTourist = async (req, res) => {
  try {
    // const {  username, email, password, mobile, nationality,job_Student } = req.body;
    const tourist = await userModel.find({ username });
    return res.status(200).send(tourist);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////


// Update a tourist
const UpdateTourist = async (req, res) => {
  try {
    const { username, email, password, mobile, nationality, job_Student, wallet } = req.body;
    console.log('Request Body:', req.body); // Log the incoming request

    // Fetch the existing tourist data
    const existingTourist = await userModel.findOne({ username });
    if (!existingTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      email: email !== undefined ? email : existingTourist.email,
      password: password !== undefined ? password : existingTourist.password,
      mobile: mobile !== undefined ? mobile : existingTourist.mobile,
      nationality: nationality !== undefined ? nationality : existingTourist.nationality,
      job_Student: job_Student !== undefined ? job_Student : existingTourist.job_Student,
      wallet: wallet !== undefined ? wallet : existingTourist.wallet
    };

    // Remove undefined fields (optional as we've handled undefined values)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    console.log('Update Data:', updateData); // Log what's going to be updated

    // Check if the email already exists but exclude the current user
    if (email && email !== existingTourist.email) {
      const existingTouristEmail = await userModel.findOne({ email, username: { $ne: username } });
      if (existingTouristEmail) {
        return res.status(400).send({ message: 'Email already exists.' });
      }
      updateData.email = email;
    }

    const updatedTourist = await userModel.findOneAndUpdate({ username }, updateData, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Updated Tourist:', updatedTourist); // Log the updated document
    res.status(200).json(updatedTourist);
  } catch (error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(400).json({ error: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Hotel city is required' });
    }

    // Call Amadeus Hotel Search API
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: city, // Replace CITY_CODE with the relevant city code, or add it as a request parameter if needed
    });

    // Check for valid response
    if (response.data && response.data.length > 0) {
      res.status(200).json({
        hotels: response,
      });
    } else {
      res.status(404).json({ message: 'No hotels found' });
    }
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: error });
  }
}

const getHotelOffers = async (req, res) => {
  try {
    const { hotelId } = req.query;

    if (!hotelId) {
      return res.status(400).json({ error: 'Hotel ID is required' });
    }

    const response = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
    });

    if (response.data && response.data.length > 0) {
      res.status(200).json({
        offers: response.data,
      });
    } else {
      res.status(404).json({ message: 'No offers found for this hotel' });
    }
  } catch (error) {
    console.error('Error fetching hotel offers:', error);

    // Check if the error code matches the "No Rooms Available" error
    if (error.description && error.description[0].code === 3664) {
      res.status(400).json({ error: 'No rooms available at the requested property' });
    } else {
      res.status(500).json({ error: 'Failed to fetch hotel offers' });
    }
  }
};

async function getValidAccessToken() {
  const { accessToken, tokenExpiryTimestamp } = await getAccessToken();
  return accessToken;
}

const bookHotel = async (req, res) => {
  const { id } = req.params;
  const { offerId, payment } = req.body;

  if (!offerId || !payment) {
    return res.status(400).json({ error: 'Offer ID and payment details are required' });
  }

  try {
    // Retrieve user information
    const tourist = await userModel.findOne({ _id: id });
    if (!tourist) {
      return res.status(404).json({ message: 'No tourist found' });
    }

    // Split user name into first and last names
    const nameParts = (tourist.username || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[1] || 'Doe';

    // Step 1: Fetch a valid access token
    const accessToken = await getValidAccessToken();

    // Step 2: Validate offer pricing immediately before booking
    const pricingResponse = await axios.get(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (pricingResponse.status !== 200 || !pricingResponse.data || !pricingResponse.data.data.offers) {
      return res.status(400).json({ error: 'Offer is unavailable or has changed' });
    }

    const bookingData = {
      data: {
        type: 'hotel-order',
        roomAssociations: [
          {
            guestReferences: [
              {
                guestReference: '1'
              }
            ],
            hotelOfferId: offerId  // Use the validated offerId here
          }
        ],
        travelAgent: {
          contact: {
            email: 'bob@example.com'
          }
        },
        guests: [
          {
            tid: 1,
            title: 'MR',
            firstName: firstName || 'Bob',  // Use firstName from tourist data
            lastName: lastName || 'Doe',  // Use lastName from tourist data
            phone: tourist.mobile,
            email: tourist.email
          }
        ],
        payment: {
          method: payment.method,
          paymentCard: {
            paymentCardInfo: {
              vendorCode: payment.vendorCode,
              cardNumber: payment.cardNumber,
              expiryDate: payment.expiryDate,
              holderName: payment.holderName,
            },
          },
        },
      }
    };

    let response = await amadeus.booking.hotelOrders.post(bookingData);

    await userModel.findByIdAndUpdate(id, { $push: { hotelBookings: response.data.id } });

    return res.status(200).json(response.data);  // Send booking response back to client

  } catch (error) {
    console.error('Error booking hotel:', error);
    return res.status(500).json({ error: 'Failed to book hotel' });
  }
};

let flightOffersCache = null;

const searchFlights = async (req, res) => {
  try {
    // Extract parameters from the request body
    const { origin, destination, departure_date, return_date } = req.body;

    // Validate required parameters
    if (!origin || !destination || !departure_date) {
      return res.status(400).json({ error: 'Missing required parameters: origin, destination, departure_date' });
    }

    // Prepare the query parameters for Amadeus flight search
    const queryParams = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departure_date,
      returnDate: return_date,  // Optional
      adults: 1  // Default to 1 adult if not provided
    };

    // Perform the flight search via the Amadeus API
    let flightOffers;
    await amadeus.shopping.flightOffersSearch.get(queryParams).then(
      function (response) {
        flightOffersCache = response;
      }
    );

    // Return the flight offers data
    return res.status(200).json(flightOffersCache.data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error searching for flights', details: error.message });
  }
};

const getFlightDetails = async (req, res) => {
  try {
    const { flightOfferId } = req.params; // Get flight offer ID from the URL parameters

    if (!flightOfferId) {
      return res.status(400).json({ error: 'Flight offer ID is required' });
    }

    const flightDetails = await amadeus.shopping.flightOffers.pricing.post({
      data: {
        type: "flight-offers-pricing",
        flightOffers: [flightOffersCache.data.find(offer => offer.id === flightOfferId)],
      },
    });

    // Return the flight details if found
    if (flightDetails && flightDetails.data) {
      return res.status(200).json(flightDetails.data);
    } else {
      return res.status(404).json({ error: 'Flight details not found' });
    }

  } catch (error) {
    console.error('Error fetching flight details:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const bookFlight = async (req, res) => {
  try {
    const { flight_offer, documents } = req.body;
    const { id } = req.params;
    // Validate the required fields
    if (!flight_offer) {
      return res.status(400).json({ error: 'Missing required parameters for booking' });
    }

    const tourist = await userModel.findById(id);

    // Create the booking request data
    const bookingData = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffersCache.data.find(offer => offer.id === flight_offer)],
        travelers: [
          {
            id: "1",
            dateOfBirth: '1982-01-16',
            name: {
              firstName: tourist.username || "BOB",
              lastName: "SMITH",
            },
            gender: "MALE",
            contact: {
              emailAddress: tourist.email,
              phones: [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "34",
                  number: tourist.mobile,
                },
              ],
            },
            documents: documents,
          },
        ],
      }
    };

    // Call Amadeus API to book the flight
    const bookingResponse = await amadeus.booking.flightOrders.post(bookingData);

    await userModel.findByIdAndUpdate(id, { $push: { flightBookings: bookingResponse.data.id } });

    // Return the booking response
    return res.status(201).json(bookingResponse.data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error booking the flight', details: error.message });
  }
};

// const hotel = async (req, res) => {
//   try {
//     // Book a hotel in BLR for 2024-10-10 to 2024-10-12 for 1 guest

//     // 1. Hotel List API to get the list of hotels
//     const hotelsList = await amadeus.referenceData.locations.hotels.byCity.get({
//       cityCode: "CAI",
//     });

//     console.log(hotelsList.data[14]);

//     // 2. Hotel Search API to get the price and offer id
//     const pricingResponse = await amadeus.shopping.hotelOffersSearch.get({
//       hotelIds: hotelsList.data[29].hotelId,
//       adults: 1,
//       checkInDate: "2024-12-10",
//       checkOutDate: "2024-12-12",
//     });

//     // Finally, Hotel Booking API to book the offer
//     const response = await amadeus.booking.hotelOrders.post({
//       data: {
//         type: "hotel-order",
//         guests: [
//           {
//             tid: 1,
//             title: "MR",
//             firstName: "BOB",
//             lastName: "SMITH",
//             phone: "+33679278416",
//             email: "bob.smith@email.com",
//           },
//         ],
//         travelAgent: {
//           contact: {
//             email: "bob.smith@email.com",
//           },
//         },
//         roomAssociations: [
//           {
//             guestReferences: [
//               {
//                 guestReference: "1",
//               },
//             ],
//             hotelOfferId: pricingResponse.data[0].offers[0].id,
//           },
//         ],
//         payment: {
//           method: "CREDIT_CARD",
//           paymentCard: {
//             paymentCardInfo: {
//               vendorCode: "VI",
//               cardNumber: "4151289722471370",
//               expiryDate: "2026-08",
//               holderName: "BOB SMITH",
//             },
//           },
//         },
//       },
//     });
//     console.log(response);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// }

// const flight = async (req, res) => {
//   try {
//     // Book a flight from MAD to ATH on 2022-08-01
//     const flightOffersResponse = await amadeus.shopping.flightOffersSearch.get({
//       originLocationCode: "MAD",
//       destinationLocationCode: "ATH",
//       departureDate: "2025-08-01",
//       adults: "1",
//     });

//     const pricingResponse = await amadeus.shopping.flightOffers.pricing.post({
//       data: {
//         type: "flight-offers-pricing",
//         flightOffers: [flightOffersResponse.data[0]],
//       },
//     });

//     const response = await amadeus.booking.flightOrders.post({
//       data: {
//         type: "flight-order",
//         flightOffers: [pricingResponse.data.flightOffers[0]],
//         travelers: [
//           {
//             id: "1",
//             dateOfBirth: "1982-01-16",
//             name: {
//               firstName: "JORGE",
//               lastName: "GONZALES",
//             },
//             gender: "MALE",
//             contact: {
//               emailAddress: "jorge.gonzales833@telefonica.es",
//               phones: [
//                 {
//                   deviceType: "MOBILE",
//                   countryCallingCode: "34",
//                   number: "480080076",
//                 },
//               ],
//             },
//             documents: [
//               {
//                 documentType: "PASSPORT",
//                 birthPlace: "Madrid",
//                 issuanceLocation: "Madrid",
//                 issuanceDate: "2015-04-14",
//                 number: "00000000",
//                 expiryDate: "2025-04-14",
//                 issuanceCountry: "ES",
//                 validityCountry: "ES",
//                 nationality: "ES",
//                 holder: true,
//               },
//             ],
//           },
//         ],
//       },
//     });
//     console.log(response);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// }

const bookTransportation = async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, destination, travelDate, travelTime, travelType } = req.body;

    if (!origin || !destination || !travelDate || !travelTime || !travelType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const transportationData = {
      origin: origin,
      destination: destination,
      travelDate: travelDate,
      travelTime: travelTime,
      travelType: travelType
    };

    await userModel.findByIdAndUpdate(id, { $push: { transportationBookings: transportationData } }, {new: true});
    res.status(200).json({message: "transportation added successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


// Export all functions using ES module syntax
export default { CreateTourist, getTourist, getOneTourist, UpdateTourist, getHotels, getHotelOffers, bookHotel, searchFlights, getFlightDetails, bookFlight, bookTransportation };

