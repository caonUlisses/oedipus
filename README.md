# Oedipus - Passing the Sphinx #

Oedipus is an auth service solution that works as a docker container for authentication and an express extension.

## How to use the docker version?

Clone the repo, cd in, and run `docker-compose build`:

```
git clone https://github.com/caonUlisses/oedipus
cd oedipus
docker-compose build
```

After everything is done, run:

```
cp .env.example .env

```
This command will create your main config file (you can customize the file on the config directory aswell), so if you want the app to run on a different port or use a different url to connect to MongoDB, change it on this file.

The last thing is to run:

```
docker-compose up
```

If everything went well, you'll have a server waiting for you to create, update, delete and login your users.

If it fails, fill a bug report, please. Or maybe help me make it better.

## How to use it as a package?

Just install oedipus with `yarn` or `npm`

```
yarn add oedipus
```

Then, on your project, import it:

```javascript
// Import express first

const express = require('express')
const { oedipus } = require('oedipus')

const app = express()

app.use('/users', oedipus)
```

Oedipus also comes with a middleware to protect your routes, which can be called as in:

```javascript
const express = require('express')
// this line down here imports oedipus and the authentication middleware
const { oedipus, authenticate } = require('oedipus')

const app = express()

app.use('/users', oedipus)

// This route will be protected, only users bearing a token will be able to access it
app.get('/', authenticate, (req, res, next) => {
    // your route here
  })

// it you want, you can protect every route, as in
// app.use(authenticate)
```

## If you have any trouble ##
ulissescaon@gmail.com
