# sveltekit-eventsourced-funnel

Example of building a SvelteKit project with event sourcing.

Demonstrates:
1. POJOs for event sourced models
2. Repository pattern for persistence via local storage

As with Redux, the logic is external to the components. You can easily hook into every event for analytics and more. See unit test of the "`Funnel` model" to see that the logic can be tested independently of the UI.

Includes Tailwind with JIT compiler for easy copy and pasting of UIs from [Tails](https://devdojo.com/tails), [TailwindUI](https://tailwindui.com/), [Shuffle](https://shuffle.dev/), or etc. 

## Quick Walkthrough

This project is a marketing and sales funnel - a simple series of web pages where the user can make a choice to proceed deeper into the funnel or not. Each step in the funnel is simply a route, in the `src/routes` directory. In `src/lib/steps.js` we create a linked-list like array of step "Value Objects". Index is the starting page.

The whole application is a `Funnel`, and thus we have a `Funnel` model in `src/lib/models/Funnel.js` - this is where the bulk of the logic resides.

There will only be one instance of a `Funnel` per browser session. To get that instance, the file `src/lib/funnel.js` provides a `load` function that will create a new funnel instance and initialize it with steps, or, if an instance already exists, load the existing one.

Each page loads the `funnel` instance `onMount`, which is client side only. The user performs some sort of action, which is a method call on the funnel object, and then, using the `funnelRepository`, the change is persisted to local storage via `commit`.

Once commits are successful, `enqueued` events fire, and we can navigate the user to their next step.

Project bootstrapped with [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Further Reading

`sourced` has been around for several years for building event sourced models for backend services. This means with `sourced` you can build your "model" microservices in the same way you build your front end models.

* https://hackernoon.com/complicated-patterns-arent-always-that-complicated-usually-it-s-the-simple-ones-that-bite-you-caf870f2bf03
