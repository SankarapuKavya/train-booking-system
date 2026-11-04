# RailWay – Train Booking System (demo project)

A learning full-stack project using React, JavaScript, Tailwind CSS, Node.js, Express and MySQL.

## Important
- This project uses **sample/demo routes and seat inventory**, not live Indian Railways schedules or availability.
- Search returns only routes explicitly represented in `backend/database.sql`.
- The demo has no user accounts. "My bookings" filters by the email entered during booking; this is for local learning only, not secure identity verification.
- The sample route times are illustrative and not operational railway timetable data.

## Requirements
- Node.js (LTS)
- MySQL Server and MySQL Workbench
- VS Code

## 1. Database
1. Open MySQL Workbench and connect to your local MySQL server.
2. Open `backend/database.sql`.
3. Execute the entire script.
4. It creates the `train_booking` database and sample station/train data.

Running this script again drops and recreates the demo tables, so it will erase existing demo bookings.

## 2. Backend
Open a terminal:

```bash
cd backend
npm install
```

Copy `.env.example` to a new file named `.env` and update `DB_PASSWORD` with your MySQL password. Do not share or commit `.env`.

Start the API:

```bash
npm run dev
```

Health check: http://localhost:5000/api/health

## 3. Frontend
Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Sample routes in the database
- Mumbai CSMT → Delhi New Delhi
- Mumbai CSMT → Bhopal
- Mumbai CSMT → Agra
- Bengaluru SBC → Bhopal
- Bengaluru SBC → Agra
- Bengaluru SBC → Delhi
- Bengaluru YPR → Bhubaneswar
- Chennai MAS → Hyderabad
- Chennai MAS → Bengaluru
- Kochi Ernakulam → Bengaluru
- Mumbai CSMT → Pune
- Mumbai CSMT → Solapur

A route is available only if a train's stop sequence includes the selected origin before the destination. Add more stations, trains and ordered stops in `database.sql` to expand the demo network.

## API endpoints
- `GET /api/trains/stations`
- `GET /api/trains/search?from=CSMT&to=NDLS&date=2026-11-06&travelClass=Sleeper`
- `GET /api/trains/seats?trainId=1&date=2026-11-06&travelClass=Sleeper`
- `POST /api/bookings/book`
- `GET /api/bookings/my-bookings?email=someone@example.com`
- `POST /api/bookings/cancel/:id` with JSON body `{ "email": "someone@example.com" }`

## Booking safety
Seat booking uses a MySQL transaction and `SELECT ... FOR UPDATE` on the selected journey-seat row. A second request for the same seat waits for the first transaction and then sees the updated status. This prevents two successful bookings for the same journey seat, assuming MySQL uses InnoDB (the default for these tables).

For a production system, add proper authentication/authorization, secure booking ownership, payment/refund flows, stronger date validation, rate limiting, audit logs and real railway data integrations.
