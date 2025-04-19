This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

src/
├── app/
│   ├── (admin)/                      # Admin route group
│   │   ├── layout.js                # Admin-specific layout
│   │   └── admin/
│   │       ├── bookings/
│   │       │   ├── [id]/            
│   │       │   │   └── page.js      # /admin/bookings/:id (View/Edit)
│   │       │   └── page.js          # /admin/bookings (List)
│   │       ├── buildings/
│   │       │   └── page.js          # /admin/buildings (CRUD)
│   │       ├── departments/
│   │       │   └── page.js          # /admin/departments (CRUD)
│   │       ├── rooms/
│   │       │   └── page.js          # /admin/rooms (CRUD)
│   │       └── schedules/
│   │           └── page.js          # /admin/schedules
│   ├── auth/
│   │   └── login/
│   │       └── page.js              # /auth/login
│   ├── bookings/
│   │   ├── my/
│   │   │   └── page.js              # /bookings/my (User's bookings)
│   │   ├── room/
│   │   │   └── [roomId]/
│   │   │       └── page.js          # /bookings/room/:roomId
│   │   ├── [id]/
│   │   │   └── page.js              # /bookings/:id
│   │   └── page.js                  # /bookings (Create/List)
│   ├── buildings/
│   │   ├── [id]/
│   │   │   └── page.js              # /buildings/:id
│   │   └── page.js                  # /buildings (List)
│   ├── departments/
│   │   ├── [id]/
│   │   │   └── page.js              # /departments/:id
│   │   └── page.js                  # /departments (List)
│   ├── rooms/
│   │   ├── [id]/
│   │   │   └── page.js              # /rooms/:id
│   │   └── page.js                  # /rooms (List)
│   ├── context/
│   │   └── AuthProvider.js          # Auth context wrapper
│   ├── layouts/
│   │   ├── RootLayout.js            # Main layout
│   │   └── DashboardLayout.js       # User dashboard layout
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.js
│   │   ├── bookings/
│   │   │   ├── BookingCard.js
│   │   │   └── BookingForm.js
│   │   ├── admin/
│   │   │   ├── AdminTable.js
│   │   │   └── DepartmentForm.js
│   │   └── ui/                      # UI components (buttons, cards)
│   │       ├── DatePicker.js
│   │       └── RoomCard.js
│   ├── utils/
│   │   ├── api.js                   # Axios instance
│   │   └── auth.js                  # Auth helpers
│   ├── middleware.js                # Route protection
│   ├── page.js                      # Homepage (/)
│   └── globals.css                  # Global styles
├── public/
│   ├── images/                      # Static assets
│   └── styles/                      # CSS modules
└── package.json