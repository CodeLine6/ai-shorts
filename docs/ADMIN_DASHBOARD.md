# Admin Dashboard Setup

This document explains how to set up and use the admin dashboard for the AI Shorts application.

## Prerequisites

1. You must have a user account in the system
2. The user account must be granted admin privileges

## Setting up an Admin User

1. Navigate to `/admin/setup` in your browser
2. Enter the email address of the user you want to make an admin
3. Click "Make Admin"
4. The user will now have access to the admin dashboard

## Accessing the Admin Dashboard

1. Ensure you're logged in with an account that has admin privileges
2. Navigate to `/admin/dashboard` in your browser
3. You should see the admin dashboard with various analytics

## Admin Dashboard Features

The admin dashboard provides the following analytics:

- **User Statistics**: Total users, verified users, and recent signups
- **Video Statistics**: Total videos created and recent uploads
- **Revenue Statistics**: Total revenue and purchase information
- **Referral Statistics**: Referral program performance
- **User Growth Chart**: Visualization of user signups over time
- **Revenue Chart**: Visualization of revenue over time
- **Video Style Distribution**: Pie chart showing the distribution of video styles
- **Top Referrers**: List of users with the most successful referrals

## Security

Only users with the `isAdmin` flag set to `true` in the database can access the admin dashboard. The middleware protects all `/admin/*` routes and redirects unauthorized users to their regular dashboard.
