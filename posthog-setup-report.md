# PostHog post-wizard report

The wizard has completed a deep integration of your Nuru Events Next.js application with PostHog analytics. The integration includes automatic pageview tracking, session recording, exception capture, and custom event tracking for key user interactions.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - PostHog initialization using Next.js 15.3+ instrumentation pattern
- `.env.local` - Environment variables for PostHog API key and host

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog to avoid ad blockers
- `components/ExploreButton.tsx` - Added event tracking for explore button clicks
- `components/NavBar.tsx` - Added event tracking for navigation link clicks
- `components/EventCard.tsx` - Added event tracking for event card clicks

### Packages Installed
- `posthog-js` - PostHog JavaScript SDK for client-side analytics

## Events Table

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `explore_events_clicked` | User clicked the Explore Events button on the homepage to browse available events | `components/ExploreButton.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the navbar (with `link_name` and `link_location` properties) | `components/NavBar.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (with event metadata properties) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/121462/dashboard/515847) - Main analytics dashboard with key metrics

### Insights
- [User Engagement Trends](https://eu.posthog.com/project/121462/insights/mHm5uHgr) - Daily trends of all tracked events
- [Event Discovery Funnel](https://eu.posthog.com/project/121462/insights/ocVR1GKE) - Conversion funnel from Explore to Event card click
- [Event Card Clicks by Location](https://eu.posthog.com/project/121462/insights/dgM7uWRa) - Breakdown by event location
- [Daily Active Users](https://eu.posthog.com/project/121462/insights/r6kXAsjW) - Unique users per action type
- [Navigation Link Breakdown](https://eu.posthog.com/project/121462/insights/ZYLaqqHD) - Which navigation links are clicked most

## Configuration

PostHog is configured with the following settings:
- **API Host**: Uses reverse proxy at `/ingest` to avoid ad blockers
- **UI Host**: `https://eu.i.posthog.com`
- **Exception Capture**: Enabled for automatic error tracking
- **Debug Mode**: Enabled in development environment
- **Defaults**: Using `2025-11-30` defaults for optimal pageview tracking

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
