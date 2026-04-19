<h3 align="center">SyncCode</h3>

<p align="center">
  <img src="./docs/images/icon.svg" alt="_picture" height="50">
</p>

<p align="center">
  SyncCode is a collaborative coding platform with real-time video integration, enabling seamless teamwork, code sharing, and remote pair programming.
</p>

<p align="center">
  <img src="./docs/read/editor.png" alt="_picture" height="400">
</p>

## Feature

#### 1. Collaborative editor:
Collaborate on code with live cursor sharing, synchronized highlighting, and follow mode to enhance team productivity and visibility.
<p align="center">
  <img src="./docs/read/collaborate.png" alt="_picture" height="400">
</p>

#### 2. Shared terminal:

Execute code and view results in real time, supporting over 70+ programming languages for versatile development workflows.
<p align="center">
  <img src="./docs/read/terminal.png" alt="_picture" height="400">
</p>

#### 3. Live preview:
Instantly preview UI changes with built-in support for popular libraries such as Tailwind CSS and others, streamlining frontend development.
<p align="center">
  <img src="./docs/read/live.png" alt="_picture" height="400">
</p>

#### 4. Shared notepad:
Take collaborative notes in real time with rich text and Markdown support, ideal for brainstorming and documentation.
<p align="center">
  <img src="./docs/read/notepad.png" alt="_picture" height="400">
</p>

#### 5. Video & voice:
Communicate with your team using integrated video and voice chat, ensuring smooth coordination during collaborative sessions.
<p align="center">
  <img src="./docs/read/video-voice-chat.png" alt="_picture" height="400">
</p>

#### 6. Github connect:
Seamlessly save and access your code directly from GitHub repositories, enabling efficient version control and project management.
<p align="center">
  <img src="./docs/read/github.png" alt="_picture" height="400">
</p>

## System Design

```mermaid
flowchart TD

    A[System Design Highlights]

    A --> B[Real-Time First]
    B --> B1[WebSocket-based architecture]
    B --> B2[Instant updates across all clients]

    A --> C[Scalable Structure]
    C --> C1[Modular services]
    C --> C2[Clear separation of concerns]

    A --> D[Low Latency]
    D --> D1[In-memory room state]
    D --> D2[Operation-based updates]

    A --> E[Efficient Networking]
    E --> E1[No redundant full-state sync]
    E --> E2[Only delta updates transmitted]

    A --> F[Fault Tolerance]
    F --> F1[Graceful disconnect handling]
    F --> F2[Room cleanup logic]
```

## Toolkit

#### Frontend
- **Framework:** Next.js, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Editor:** Monaco Editor, Sandpack (live preview)
- **Collaboration:** Socket.IO Client, simple-peer (WebRTC)
- **Notepad:** MDXEditor
- **Forms:** React Hook Form + Zod

#### Backend
- **Runtime:** Node.js, TypeScript
- **Real-time:** Socket.IO (WebSockets.js server)

#### Testing
- **E2E:** Playwright
- **Unit:** Jest
- **Security:** CodeQL

#### Code Quality
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky
- **Commit Linting:** commitlint

#### Build & DevOps
- **Monorepo:** Turborepo
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (frontend), Render (backend)

#### Monitoring & Analytics
- **Error Tracking:** Sentry
- **Web Analytics:** Vercel Analytics, Cloudflare Web Analytics
- **Uptime & Status:** Better Stack

#### External Services
- **Code Execution:** Piston
- **Repository Management:** GitHub REST API

## e2e Run

```mermaid
flowchart TD

    A[User Opens App] --> B[Socket Connection Initialized]

    B --> C{Create or Join Room}

    C -->|CREATE| D[Create Room]
    C -->|JOIN| E[Validate & Join Room]

    D --> F[Assign Custom User ID]
    E --> F

    F --> G[Initial Sync Request]

    G --> G1[SYNC_USERS]
    G --> G2[SYNC_CODE]
    G --> G3[SYNC_MD]

    G1 --> H[Server Sends Room Users]
    G2 --> H2[Server Sends Code State]
    G3 --> H3[Server Sends Markdown]

    H --> I[Workspace Ready]
    H2 --> I
    H3 --> I

    I --> J{User Actions}

    %% Code Collaboration
    J -->|Edit Code| K[Emit UPDATE_CODE]
    K --> L[Server Updates Room State]
    L --> M[Broadcast to Other Users]
    M --> N[Apply Changes in Editors]

    %% Presence
    J -->|Cursor / Pointer / Scroll| O[Emit Presence Events]
    O --> P[Broadcast to Room]
    P --> Q[Update UI for All Users]

    %% Code Execution
    J -->|Run Code| R[Emit EXEC true]
    R --> S[Call /api/execute]
    S --> T[Execute via External API]
    T --> U[Emit UPDATE_TERM]
    U --> V[Broadcast Output]
    V --> W[Emit EXEC false]

    %% WebRTC
    J -->|Video/Audio| X[Emit STREAM_READY]
    X --> Y[Signal Exchange]
    Y --> Z[Peer-to-Peer Connection]

    %% Cleanup
    I --> AA{Leave / Disconnect}
    AA --> AB[Remove User from Room]
    AB --> AC[Update User List]
    AC --> AD{Room Empty?}
    AD -->|Yes| AE[Delete Room State]
    AD -->|No| AF[Continue Session]
```


## Architecture

#### 1. Connection Layer

When a user opens the application:

- A singleton socket connection is initialized from the client (`socket.ts`)
- Ensures:
  - Only one active connection per tab
  - Efficient event communication
  - Persistent connection throughout the session

#### 2. Room Lifecycle

Users can:

- Create a new room `CREATE`
- Join an existing room `JOIN`

Backend Flow:

1. Client emits event with `roomId`
2. Server:
   - Validates room existence (for JOIN)
   - Creates room (for CREATE)
   - Assigns a custom unique user ID
   - Stores user in room state

Why Custom User ID?

- Tracks users independent of socket ID  
- Helps in reconnection  
- Maintains identity consistency  

Handled In:

- `room-service.ts`

#### 3. Initial Synchronization
After joining, the client has no state → requests full sync.

Events Emitted:

- `SYNC_USERS`
- `SYNC_CODE`
- `SYNC_MD`

Server Responds With:

- Current users in room  
- Latest code snapshot  
- Markdown content  
- Execution / terminal state  

Ensures:
- New users instantly match room state  
- No inconsistencies across clients  

#### 4. Code Collaboration

Core feature of the system.

Flow:

1. User types in Monaco Editor  
2. Editor emits `UPDATE_CODE` (operation-based changes)  
3. Server:
   - Applies operation to in-memory room state  
   - Broadcasts update to other users  
4. Clients:
   - Apply update to editor model  
   - Avoid re-emitting (prevents loops)  

Key Design:

- Operation-based updates → efficient  
- In-memory storage → low latency  
- Broadcast model → real-time sync  

Handled In:

- `editor-service.ts`
- `code-service.ts`


#### 5. Presence & Telemetry System

Tracks real-time user activity.

Includes:

- Cursor position  
- Mouse movement  
- Scroll position  

Flow:

1. Client emits frequent updates  
2. Server broadcasts to room  
3. Other users visualize activity  

Design Notes:

- Lightweight events (no persistence)  
- High-frequency → optimized for speed  

Handled Services:

- `user-service.ts`
- `pointer-service.ts`
- `scroll-service.ts`

#### 6. Code Execution Pipeline

Allows users to run code collaboratively.

Flow:

1. User clicks **Run** 
2. Client:
   - Emits `EXEC true`  
   - Calls `/api/execute`  
3. Backend:
   - Sends code to execution service  
   - Receives output  
4. Server:
   - Emits `UPDATE_TERM` (output)  
   - Emits `EXEC false`  

Output is synced across all users.

Execution Provider:

- Uses **Piston**
- Supports multiple languages  
- Stateless HTTP execution  


#### 7. WebRTC Communication

Peer-to-peer communication using WebRTC.

Flow:

1. User ready → `STREAM_READY`  
2. Peers exchange signaling → `SIGNAL`  
3. Server acts only as relay  

Media flows directly between peers (P2P).

Handled In:

- `webrtc-service.ts`


#### 8. Cleanup & Resource

When a user disconnects:

Server Actions:

- Remove user from room  
- Update remaining users  
- Broadcast updated user list  

If Room is Empty:

- Delete room data  
- Free memory  

## Structure
``` Java
    SyncCode
    ├── apps/                    # Application packages for frontend and backend services
    │   ├── client/              # Frontend Next.js application
    │   │   ├── public/          # Static assets (images, fonts, etc.)
    │   │   ├── src/             # Source code for the frontend
    │   │   │   ├── app/         # Next.js app router pages and API routes
    │   │   │   ├── components/  # Reusable React components
    │   │   │   ├── hooks/       # Custom React hooks for state and logic management
    │   │   │   └── lib/         # Utility functions and shared services
    │   │   └── tests/           # Frontend test suite (Playwright)
    │   └── server/              # Backend Socket.IO server
    │       ├── src/             # Source code for the backend
    │       │   ├── service/     # Backend business logic and services
    │       │   └── utils/       # Utility functions for backend operations
    │       └── tests/           # Backend test suite (Jest)
    ├── docs/                    # Documentation assets and guides
    ├── packages/                # Shared packages across applications
    │   └── types/               # Shared TypeScript types and interfaces
    ├── scripts/                 # Build, deployment, and maintenance scripts
    ├── package.json             # Root package.json for workspace dependencies
    └── pnpm-workspace.yaml      # PNPM workspace configuration for monorepo management

```

## Installation
1. **Prerequisites**

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [pnpm](https://pnpm.io) (v6 or higher)

If pnpm is not installed, run:
```bash
    npm install -g pnpm
```

2. **Clone**

```bash
    git clone https://github.com/harshkunz/SyncCode
    cd SyncCode

    pnpm install
```

3. **Environment setup**

Create apps/client/.env

```bash
    BETTERSTACK_API_KEY=
    SENTRY_AUTH_TOKEN=
    GITHUB_CLIENT_SECRET_PROD=
    GITHUB_CLIENT_SECRET_DEV=
    SENTRY_SUPPRESS_TURBOPACK_WARNING="1"
    TURBO_TEAM=
    TURBO_TOKEN=
```
Create apps/server/.env

```bash
    CLIENT_URL=
    SERVER_URL=
    GITHUB_CLIENT_ID_PROD=
    GITHUB_CLIENT_SECRET_PROD=
```

4. **Run Server**

```bash
    pnpm dev        # Both server

    pnpm --filter client dev
    pnpm --filter server dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001


## Test
Run all frontend E2E tests from the root or client workspace:

```bash
    pnpm test:client            # Execute all frontend E2E tests
    pnpm test:client:ui         # Run tests in UI mode
    pnpm test:client:debug      # Debug frontend tests
    pnpm test:client:report     # View test report

    # Run tests only in the client workspace
    pnpm --filter client test:client
```

Run backend tests from the root or server workspace:

```bash
    pnpm test:server            # Execute backend tests against local server
    pnpm test:server:remote     # Run backend tests against remote server
    pnpm test:server:watch      # Run backend tests in watch mode (local server)

    # Run tests only in the server workspace
    pnpm --filter server test:server
```

## Deployment
Build the entire project with Turborepo caching:
```bash
    pnpm build
    or
    pnpm build:client           # Build frontend
    pnpm build:server           # Build backend
```

Linting and Formatting

```bash
    pnpm lint                   # Run ESLint checks
    pnpm lint:fix               # Fix ESLint issues
    pnpm format                 # Check formatting
    pnpm format:fix             # Fix formatting issues
```


> Run scripts (without Turborepo caching):

```bash
    # Frontend specific
    pnpm --filter client dev
    pnpm --filter client build
    pnpm --filter client test:e2e

    # Backend specific
    pnpm --filter server dev
    pnpm --filter server build
    pnpm --filter server test:socket
```

## Contributing
Open to contributions!
- Fork the repository  
- Create a new branch (`git checkout -b feature-name`)  
- Commit your changes (`git commit -m 'Add feature'`)  
- Push to the branch (`git push origin feature-name`)  
- Create a Pull Request