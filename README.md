# Trailmap

This is a React-on-Rails monorepo application for displaying biking and walking trails in Massachusetts.

## Setup
1. Run `bin/setup`
2. Set your `MAPBOX_API_TOKEN` into your .env file (you can generate an access token at account.mapbox.com)
3. In two terminals, run `bundle exec rails s` and `bin/wepack-dev-server`

## Deployment
1. In one terminal window, ssh into either the prep or live servers
2. In another, run either `cap staging deploy` or `cap production deploy`. Note that staging deploys from Github's `develop` branch and production deploys from the `master` branch.