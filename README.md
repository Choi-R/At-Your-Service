# Backend
This is the backend repository of AYS (At Your Service) app

## Requirement
* These code was made with ```node``` version ```12.13.1```. So to be safe, you might want to use that version.
* Use/type ```npm install``` to install all of the package.json dependencies 

## How to run
### Setup environment
```bash
touch .env
echo 'SECRET_KEY=YOUR_SECRET_KEY_FOR_JWT' >> .env
echo 'NODE_ENV=YOUR_DATABASE_ENVIRONMENT' >> .env
echo 'IMAGEKIT_PUBLIC_KEY=YOUR_IMAGEKIT_PUBLIC_KEY' >> .env
echo 'IMAGEKIT_PRIVATE_KEY=YOUR_IMAGEKIT_PRIVATE_KEY' >> .env
echo 'urlEndpoint=YOUR_IMAGEKIT_urlEndpoint' >> .env
echo 'BASE_URL=YOUR_BASE_URL' >> .env
echo 'SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY' >> .env
```
### Setup repository for development environment 
```bash
NODE_ENV='development'
npm run dev
```
### Setup repository for testing environment
```bash
NODE_ENV='test'
npm test
```

### Setup repository for staging environment
```bash
NODE_ENV = 'staging'
npm start
```

### Setup repository for production environment
```bash
NODE_ENV='production'
npm start
```

## Others
### Documentation
Swagger was used to create the documentation. The URL is [Documentation link](buku-saku-glints.herokuapp.com/documentation)

