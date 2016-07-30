# Intro

I'm newbie in ROR, so I split client and server.
* server - provide simple REST API
* client - manage browser side routing and communicate with API, like many other SPA

# Howto start

```bash
# Server
cd server
bundle install
rake db:migrate
# RAILS_ENV=test rake db:migrate && rspec
# Sorry I don't provide server side tests
rails s

# Client
cd client
npm install
npm test
npm start

# Then open http://localhost:3001
```

# About solution

* No registration and authorization
* By default CORS allows request from `localhost:\d+`,
  you can overade it: `export CORS='http://192.168.1.100:8080'`
* Each API user (include `client`) can create new `competitions`,
  get existed by `/api/competitions/:id` and create `entries`
* When user try to create new `competition` server checks provided `mail_api_key` by Mailchimp API
* On client I used angular commponents and commponents based routing -
  because it is a simple way to use angular such as it was intended -
  for building applications from small bricks.
* When client PUSHes something to the server -
  component which is the master of the process shows status of process -
  to improve user experience.
* Layout is made as simple as possible.
  Consider it as a backbone, on which you can build anything.

# Note

To register new `competiotion` you need MailChimp API Key and one or more MailChimp MailLists
* Go to [admin.mailchimp.com/account/api/](https://admin.mailchimp.com/account/api/) and create new API Key
* Go to [admin.mailchimp.com/lists/](https://admin.mailchimp.com/lists/) and create new one.
* Well done, use you API Key to Sync MailList in client interface
  [http://localhost:3001/competitions/new](http://localhost:3001/competitions/new)
