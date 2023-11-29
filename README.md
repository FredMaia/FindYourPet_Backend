# Find Your Pet app - Backend

## Overview

The "Find Your Pet" app is a community-driven platform built to help reunite lost pets with their owners. Leveraging the power of React Native for the mobile interface, Express for the backend, and MongoDB for data storage, the app provides a seamless experience for users looking to connect with pet owners in their local area. Here are some of the features: 

-**User authentication**: Secure storage using bcrypt and jwt.
-**Forgot password**: Recover functionality using Nodemailer to send password reset emails.
-**Adm role**: allow administrators to manage user posts, including the ability to delete and update them.
-**Create posts**: Users can easily create posts about their pets so other people with the same location can see it.
-**Saving pets**: Once a lost pet is found, owners can add it to found pets model, making it visible to everyone using the app.

### Controllers
### Auth
| HTTP Method | Route                        | Description                                          | Parameters                                      | Middleware                    |
|-------------|-----------------------------|------------------------------------------------------|-------------------------------------------------|-------------------------------|
| POST        | /auth/register               | Creates a new user with bcrypt encryption            | {email, password, name, phoneNumber, state, city} | None                          |
| POST        | /auth/login                  | Authenticates the user                               | {email, password}                               | None                          |
| POST        | /auth/forgot-password        | Initiates password recovery using nodemailer        | {email}                                         | None                          |
| POST        | /auth/reset-password         | Resets the user's password                           | {email, token, newPassword}                      | None                          |
| GET         | /auth/profile                | Verifies if the profile is logged in                 | None                                            | AuthMiddleware                |
| GET         | /auth/profile/adm            | Verifies if the profile is logged in and is an admin | None                                            | AuthMiddleware, AdminMiddleware |

### Posts

| HTTP Method | Route                        | Description                                     | Parameters                                                 | Middleware                  |
|-------------|-----------------------------|-----------------------------------------------|------------------------------------------------------------|-----------------------------|
| GET         | /posts                      | Retrieves all posts                            | None                                                       | None                        |
| GET         | /posts/id/:postId           | Retrieves a specific post by ID                | None                                                       | None                        |
| POST        | /posts/                     | Creates a new post                             | { description, username, city, state, userPhoto, petName, userNumber } | AuthMiddleware               |
| PUT         | /posts/:postId              | Updates a specific post by ID                  | { description }                                            | AuthMiddleware, AdminMiddleware              |
| DELETE      | /posts/:postId              | Deletes a specific post by ID                  | None                                                       | AuthMiddleware               |
| POST        | /posts/featured-image/:postId| Updates the featured image of a post           | Multipart (featuredImage)                                  | AuthMiddleware               |
| POST        | /posts/userPhoto/:postId    | Updates the user photo associated with a post | Multipart (featuredImage)                                  | AuthMiddleware               |
| POST        | /posts/images/:postId       | Updates the images associated with a post      | Multipart (images)                                         | AuthMiddleware               |



### Pets
| HTTP Method | Route           | Description            | Parameters            | Middleware      |
|-------------|----------------|------------------------|-----------------------|------------------|
| GET         | /pets           | Retrieves all pets      | None                  | None             |
| POST        | /pets/saved     | Creates a new pet       | {petName, petOwner, petImage} | AuthMiddleware             |


## Technologies used in server side

- **Express**: For the backend server.
- **MongoDB**: As the database for storing pet, posts and user information.

## How to Run it

1. Make sure you have Node.js installed.
2. Create and put your mongodb url in the .env file.
3. Navigate to the backend directory.
4. Run the following commands:

```bash
npm install
npm run dev
```

*If you wanna test nodemailer routes, put your credentials at ./src/modules/Mailer.js

### Mobile app

You can checkout the mobile app repository by clicking [here](https://github.com/fredmaia/FindYourPet_Mobile)

This project were made to **CompJR** recruitment process