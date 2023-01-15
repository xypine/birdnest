# Birdnest

https://assignments.reaktor.com/birdnest/

## Infrastructure

This is a frontend written for [birdnest-api](https://birdnest-api.eliaseskelinen.fi), written in svelte & typescript.

It uses client-side hydration: the server renders the application state at the moment of the request and javascript picks up the task of fetching new data and rendering it on the client-side. As a nice bonus, the app mostly works without javascript!

## About the animations

By default, the map visualization interpolates drone positions, making it easier to track drones between updates. However, this causes a delay of one update (by default 2 seconds).
