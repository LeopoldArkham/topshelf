# TopShelf

## Client side stack
- React
- React-router
- Axios for HTTP requests

## Server side stack
- Node.js
- Express
- request for HTTP requests

### Design choices
- **The Fridge:**
Since the app is meant to manage groceries for a company kitchen, the app contains a Fridge, where all items are sent once they are marked as completed from a list. Items can then be deleted from the fridge as they are used. This has two benefits:
  - Users can make informed decisions about what to add to their grocery lists, even if they are away from the office
  - The fridge is used to drive the recipe suggestions. For each item in the fridge, the app will display one recipe suggestion based on that item. This made more sense to me than having suggestions be based on grocery lists, since a grocery list usually comes from a recipe, and not vice-versa.
- **Navigation:** The app uses react-router for declarative routing. A permanent navigation bar takes the user back to the home page, or to his profile, where he can see items assigned to him, as well as the money he has spent.
- **Item completion:** Lists can be public, or private to one user. In public lists, a user taps an item to put it into the "Assigned" pool. Tapping an assigned item prompts the user for its price, and places the item in the "Completed" pool. A user can visit his profile page to see all the items he has assigned himself across public lists.
Note that the "assigned" label is meant to be informative, not coercive: Any user can complete another's assigned item; in that case, the backend will update the assignee to keep the stats about spending correct.
Items in private lists do not have an assignment step, and go straight to completion when tapped.
- **Stats:** The completion level of a list is shown above it, in the for or a colored segmented bar. This is both visually pleasing, and an attempt to "gamify" the system, making it more attractive to users.
- **Backend:** The backend is built around a Database Abstraction Layer for future upgradability. The `DBAL_dev` module contains a handler for each API endpoint. It uses in-memory structures to store the data, and is initialized with some dummy values to facilitate testing.
To upgrade to a real database system, this file should be duplicated and its methods reimplemented for the new backend. Backends can then be switched easily by changin the relevant import line in `index.js`
-**State Management:** Though redux and mobx were considered, I decided to store as little state as possible within react, and make the API the single source of truth. All requests that modify data on the backend recieve a response containing the updated data. Removing all business logic from the client side makes for cleaner React code, less points of failure, and better respects SRP.

### Future development
Here are the steps (in order of execution) I think should be taken next if this project was to be taken from prototype- to production-quality:

- **Tests:** A testing framework for the client side should be used to make development safer and faster.
- **Database:** The project should be updated to use a real database using the steps mentioned above. The testing framework would prevent regressions and bugs while reimplementing the endpoint handlers.
- **User login and Management**: See below for more.
- **UI:** The UI should be redesigned using a react-aware UI kit. I went back on my initial intention to use one right away as I realized that they may have a hidden learning curve and unduly complicate rapid iteration dureing early development.
- **Extra features:** 
    - Auto-delete lists when they are empty
    - Add a picture upload prompt when completing an item so that a photo of the receipt can be stored for items meant to be refunded.
    - Enhance the recipe suggestion by finding recipes that use more than one item from the fridge, displaying the recipe thumbnails, and automatically creating lists from missing ingredients.

### Flaws
There are two main flaws in the systems as it stands:
- **Mock backend:** I didn't use an object-heavy model for storing data in the dev backend in an attempt to imitate the table-oriented storage model of SQL. However, not having SQl's ability to robustly generate unique identifiers for items and keep track of clean relationships makes some of the backend code uglier than it should be, especiall with regards to the distinction between private and public data. Functions that contain a lot of unpleasant duplication of code are marked `@parallel` in the source.
- **User login:** For lack of time, I did away with any user login and verification. The code is user-aware, but makes no attempt to validate the origin of a given request. However, as user authentification is done via middleware and has minimal UI requirements, this could be implemented reasonably quickly.

Parts of the code would also benefit from some refactoring. Helper functions could be factored out in the backend, components could enforce a clearer separation between view components, controlled components and containers; the Groceries component should be broken down into smaller ones.
