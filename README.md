# StayAwhileAPI

baseUrl = https://stayawhileapi.onrender.com

## Auth

1. Login (POST)

-   /auth/login

2. Register (POST)

-   /auth/register

## Booking

1. Create a booking for a cabin (POST)

-   /booking/:cabinId

2. get all bookings (GET)

-   /booking/:userId

3. get a single booking (GET)

-   /booking/:bookingId

4. update a booking or confirm (PUT)

-   /booking/:bookingID
    // to confirm or cancel a booking request

## Cabin

1. Create a cabin (POST)

-   /cabin/:userId

2. get all cabins (GET)

-   /cabin

3. get a single cabin (GET)

-   /cabin/:cabinId

4. update a cabin (PUT)

-   /cabin/:cabinId

5. delete a cabin (DELETE)

-   /cabin/:cabinId

## Profile

1. delete a profile (DELETE)

-   /profile/:userId

2. get a single profile (GET)

-   /profile/:userId

3. update a profile (PUT)

-   /profile/:userId

4. rate a profile (POST)

-   /profile/rate/:userId
