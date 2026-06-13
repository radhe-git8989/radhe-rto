# Radhe Insurance Expiry Tracker - Implementation Plan

## Project Overview
A full-stack web application to track vehicle insurance policies, calculate expiry dates, and notify users about upcoming expiries.

## Tech Stack
- **Frontend:** React (TypeScript) + Vite
- **Backend:** Python (Flask)
- **Database:** SQLite
- **Styling:** Vanilla CSS

## Features
1. **Dashboard:** Table view of all insurance policies.
2. **Data Entry Form:** Add new policy (Customer Name, Vehicle No, Insurance Company, Issue Date, Price).
3. **Auto-Expiry Calculation:** `expiry_date` = `issue_date` + 1 year.
4. **Highlighting:** Highlight policies expiring within 5 days.
5. **Notifications:** "Action Required" message for nearing expiries.

## Directory Structure
```
radhe_insurance/
├── backend/
│   ├── app.py           # Flask server & routes
│   ├── database.db      # SQLite database
│   └── requirements.txt # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.tsx
    │   │   ├── Form.tsx
    │   │   └── Notification.tsx
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    ├── package.json
    └── ...
```

## Implementation Steps
### Phase 1: Backend Setup
- Initialize Flask app.
- Set up SQLite database with `sr_no`, `customer_name`, `vehicle_no`, `insurance_company`, `issue_date`, `price`, `expiry_date`.
- Implement API endpoints:
  - `GET /api/policies`: Fetch all policies.
  - `POST /api/policies`: Create a new policy.

### Phase 2: Frontend Setup
- Initialize React project using Vite with TypeScript.
- Create components for the Dashboard and Form.
- Implement API services to communicate with the Flask backend.

### Phase 3: Business Logic
- Calculate `expiry_date` in backend or frontend (backend preferred for consistency).
- Implement filtering/highlighting logic in the frontend.

### Phase 4: Styling & Refinement
- Apply Vanilla CSS for a clean, professional look.
- Ensure responsiveness.

### Phase 5: Testing & Validation
- Verify data entry and display.
- Verify expiry logic and highlighting.
