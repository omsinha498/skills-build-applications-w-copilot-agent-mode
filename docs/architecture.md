# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Implement the data tier first, then API services, then presentation components, using the contract tests below at each stage. Authentication remains a follow-up challenge.

- Presentation tier decision: Use React 19 with React Router and Bootstrap on Vite port `5173`; load data through the shared API client using relative `/api` paths and show accessible loading, empty, and error states.
- Logic tier decision: Keep Express routes thin on port `8000`, with validation, points calculation, ranking, and recommendations in TypeScript services; return deliberate 4xx responses for invalid input or missing records.
- Data tier decision: Use Mongoose schemas for User, Team, Activity, and Workout with required fields and references in MongoDB on port `27017`; seed linked records with idempotent upserts that preserve unrelated data.
- Activity tracking approach: Validate existing user and team IDs, activity type, and positive minutes before creating a record; compute points in the service, store occurredAt, and return activities through the GET and POST contracts.
- Team management approach: Validate team names, mascots, and member references; persist and return the submitted name, mascot, and members through the teams API, defaulting members to an empty array.
- Leaderboard approach: Aggregate activity points by team, join team names, sort totals highest first, and assign 1-based ranks in the service.
- Workout suggestions approach: Look up the user by email, select workouts matching recent activity patterns or the fitness goal, include an explanatory reason, and return `404` for an unknown user.

## Test plan

Record the commands you run and what each failure means.

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend`
- API command: `npm run test:api --prefix octofit-tracker/backend`
- Frontend command: `npm test --prefix octofit-tracker/frontend`
- Backend build command: `npm run build --prefix octofit-tracker/backend`
- Frontend build command: `npm run build --prefix octofit-tracker/frontend`
