# Trailmap

This is a React-on-Rails monorepo application for displaying biking and walking trails in Massachusetts.

## Setup
1. Create a .env file in the root directory and declare your `MAPBOX_API_TOKEN`. You can generate an access token or use the default from [account.mapbox.com](account.mapbox.com).
2. Install local dependencies by running `yarn install` and upgrading if necessary.
3. Run `bin/setup`.
4. If bin/setup fails and an error states that the Gemfile is locked to a deprecated version of Mimemagic, run `bundle update mimemagic` before retrying `bin/setup`.
5. For postgres setup, run the following commands to create a local database:

  `rake db:create` <br>
  `rake db:setup` <br>
  `rake db:seed`

6. To start your development server, run the first command in one terminal, and the second command in another:
 
`bundle exec rails s` <br>
`bin/webpack-dev-server`

## Deployment
1. In one terminal window, ssh into either the prep or live servers.
2. In another, run either `cap staging deploy` or `cap production deploy`. Note that staging deploys from Github's `develop` branch and production deploys from the `master` branch.
