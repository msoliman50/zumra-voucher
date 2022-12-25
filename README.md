# Zumra Voucher

## How to run MongoDB Instace

- To spin mongoDB instance you need to run

```
docker-compose up -d
```

the above command will give you 2 things:

- MongoDB instance running on port `27017` and it's mandatory for running the app or test cases
- MongoDB webclient, you can access it `http://localhost:8081/` if you would like to explore db collections

## How to run test cases

- To run the test cases, first make sure the mongoDB is up and running

```
# Install the needed dependencies
npm i
```

```
# Run test cases
npm test
```

## How to run the app

- To run the app, first make sure the mongoDB is up and running

```
# Install the needed dependencies
npm i
```

```
# Run the app
npm run dev
```

## Notes

- You don't need to worry about env variables, it's already has some default values (hard-coded) in the code, just for simplicity but in production of course this will not be the case
- If you would like to set env variables, you can rename the .env.example to .env and you're good to go
- I can run the app in a docker container as well, but i just left it as-is for simplicity

## API Documentation

> NOTE: `We can use Swagger for the API documentation, but this is just for simplicity`

#### HealthCheck

- **GET** `{host}/healthcheck`

#### Vouchers

- **GET** `{host}/api/vouchers`
- **GET** `{host}/api/vouchers/:id`
- **POST** `{host}/api/vouchers`

```
{
    type: optional[string], could be 'fixed' or 'percentage',
    value: required[number], min:1, max:100 (in case of percentage)
}
```

- **PUT** `{host}/api/vouchers/:id`

```
{
    type: optional[string], could be 'fixed' or 'percentage',
    value: optional[number], min:1, max:100 (in case of percentage)
}
```

- **DELETE** `{host}/api/vouchers/:id`

#### Users

- **GET** `{host}/api/users`
- **GET** `{host}/api/users/:id`
- **POST** `{host}/api/users`

```
{
    name: required[string]
}
```

#### Orders

- **GET** `{host}/api/orders`
- **GET** `{host}/api/orders/:id`
- **POST** `{host}/api/orders`

```
{
    userId: required[string],
    voucherId: optional[string]
}
```
