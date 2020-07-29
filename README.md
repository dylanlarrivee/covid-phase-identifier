# Covid Phase Identifier

This is a web application that will tell you what phase your county is in for the Washington Safe Start program (COVID-19) based on the zip code you enter.

## How it works

This works by using the Google Maps API to convert your zip code to a county and then scraping the https://coronavirus.wa.gov website to determine what phase of the program you are in.

## Technologies used

React, Node, Express, Google Maps API, Cheerio for web scraping, Hosted on Heroku

## Demo

To see this live in action you can click [here]().

## Getting Set Up

### Running Locally

1. Clone this repo to your local environment.
2. cd into the covid-phase-identifier folder.
3. Run `npm install`.
4. cd into the client folder.
5. Run `npm install`.
6. cd into the covid-phase-identifier folder.
7. Run `npm run dev` to start up the client and server and run in development mode.


### Running on Heroku

1. Clone this repo to your local environment.
2. cd into the covid-phase-identifier folder.
3. Run `npm install`.
4. cd into the client folder.
5. Run `npm install`.
7. Edit the client .env file to have your Google API key with the variable: REACT_APP_GEOCODER_API_KEY.
8. Edit the server .env file to contain the following variables: NODE_ENV, PORT and API_KEY.
9. Push your app up to Heroku:
    1. Sign up for a free Heroku account.
    2. Run `heroku local web`.
    3. Run `git add .`.
    4. Run `git commit -m "commit for Heroku`.
    5. Run `heroku login` and enter your login credentials.
    6. Run `heroku create`.
    7. Run `heroku push master`.
10. From the CLI, run `heroku open` to start your app.
11. Enter in your z

## Screen Shots