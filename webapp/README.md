# Clarity - AI Finance Coach (Gen Z Edition)

A friendly AI finance coach that explains money like a smart friend—clear, visual, honest, and non-judgmental.

## Overview

Clarity is designed for 18-30 year olds who are just starting their financial journey. No lectures, no judgment, just clarity.

## Features

### Onboarding
- Welcome screen with calming introduction
- Monthly income slider
- Fixed expenses input (rent, EMI)
- Financial vibe selection (control, save, invest, figuring out)
- Intro explaining capabilities

### Home Dashboard
- Personalized greeting
- Money Snapshot with spend vs save ring chart
- Cash balance trend visualization
- Rotating smart insight cards
- Quick action nudges

### Smart Assistant Chat
- Conversational interface with visual responses
- Inline bar charts and progress visuals
- Suggested questions for new users
- Friendly, non-judgmental tone

### Spending Insights
- Category breakdown with progress bars
- Month-over-month comparison
- Smart pattern recognition
- Trend indicators without scary alerts

### Savings & Goals
- Slider-based goal setting
- "What happens if..." simulation
- Timeline calculations
- Progress tracking

### Investment Explainer (Learn)
- Plain-language investment topics
- Risk spectrum visualizer
- Expandable topic cards
- Common questions section

## Design System

- **Theme**: Dark, modern, calm
- **Font**: Plus Jakarta Sans
- **Colors**: Soft teal primary, purple accent, muted states
- **Cards**: Glassmorphism-lite with rounded corners

## Tech Stack

- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for visualizations
- localStorage for demo data persistence

## Routes

- `/` - Home Dashboard (redirects to onboarding if new user)
- `/onboarding` - 3-step onboarding flow
- `/chat` - Smart Assistant conversation
- `/insights` - Spending insights
- `/goals` - Savings & goals
- `/learn` - Investment education
