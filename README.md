# Crafting Sample App

This app provides a client and a server that simulate a simple crafting system.

The client uses Next.js and React to provide a simple UI for the user to interact with the server. The server uses NestJS to provide simple APIs for the client to interact with. The server generates signatures by calling Immutable Signing API.

## Getting Started

To get started, you will need to have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).

Once you have Node.js installed, you can clone this repository. 

### Running the Server

To run the server, navigate to the `server` directory and run the following command to configure the server:

```bash
copy .env.example .env
```

Fill the necessary environment variables in the `.env`. Then, run the following command to start the server:

```bash 
yarn install # install dependencies
yarn start # start the server
```

The server will start on `http://localhost:3000`.

### Running the Client

In a separate terminal, navigate to the `client` directory and run the following command to configure the client:

```bash
copy .env.example .env
```

Then, run the following command to start the client:

```bash
yarn install # install dependencies
yarn dev --port 3001 # start the client
```

The client will start on `http://localhost:3001`.

## Testing

Open your browser and navigate to `http://localhost:3001` to see the client in action. You can interact with the client to craft items and see the server generate signatures.

1. Login with Passport
2. Click on the `Execute` on `Only Mint` recipe to mint a new item
3. Click on the `Execute` on `Burn and Mint` recipe to burn two items and mint a new item 
