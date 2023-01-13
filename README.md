# Tyba backend API

This is the start of the project

## Using Docker

### Build project

To build the services it's necessary to include the environment
variables needed to setup postgres, these should be stored in `.env`
file

  ```sh
  docker compose --env-file .env build
  ```

### Test API

In order to test the API, it is necessary to have already built the
services. Once you've done that, you can run the following command:

  ```sh
  docker compose run --rm api npm run test:docker
  ```

The option `--rm` allows this command to automatically remove the
container when it exist, i.e: when the test run finished.

### Running API

In order to use the API, it is necessary to have already built the
services. Once you've done that, you can run the following command:

  ```sh
  docker compose up
  ```

### Stop and remove API

If you want to get rid of the containers for services and volumes,
you should run:

  ```sh
  docker compose down --volumes
  ```

## Scripts

These are a few useful scripts, more will be added to improve DX

### Setup

```bash
npm install
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

### Development

```bash
npm run dev
```
