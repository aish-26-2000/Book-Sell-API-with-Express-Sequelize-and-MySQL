| APIs               | VERB   | Parameters                    | Description             |
| ------------------ | ------ | ----------------------------- | ----------------------- |
| /home              | GET    | None                          | Home Page               |
| /admin             | POST   | (title,author,price,quantity) | Add a new book          |
| /admin/:id         | PATCH  | (title/author/price/quantity) | Update a book           |
| /admin/:id         | DELETE | book id                       | Soft delete a book      |
| /admin/hdelete/:id | DELETE | book id                       | Hard delete a book      |
| /admin/purchases   | GET    | None                          | Get purchase report     |
| /admin/:id         | DELETE | book id                       | Soft delete a book      |
| /auth              | POST   | (username,password,role)      | SignUp                  |
| /auth              | POST   | (username,password)           | SignIn                  |
| /books?page=       | GET    | None                          | Get all books           |
| /books/:id         | GET    | Book id                       | Find a book             |
| /purchase/:id      | GET    | Book id                       | Check book availability |
| /purchase/:id      | POST   | (user id,book id,quantity)    | Purchase a book         |
| /users             | GET    | None                          | Get all users           |
| /users/:id         | GET    | User id                       | Get user data           |
| /users/:id         | DELETE | User id                       | Delete a user           |
