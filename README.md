# TaskSet: Todo list app

## Description

This is a Todo list application built using SvelteKit for all of the main functionalities and [Auth0](https://auth0.com/) for authentication. It is hosted by Vercel and can be found here: [www.taskset.org](https://taskset.org/). It uses a PostgreSQL database that is uploaded to [Railway](https://railway.app).

I have added all the basic necessary functionalities. The user can add, delete, and modify tasks. Those actions are handled by the API, which is then connected to the Postres database. To make this communication easier to develop, I used [Prisma](https://www.prisma.io/). It uses ORM (object-relational mapping) and allows you to write SQL queries using JavaScript objects. It uses a Prisma schema file. In it, you will find your database url (which can be either a railway url or a local url to your PostgreSQL database) as well as your database table and its properties (in my case, all the necessary task-related properties such as description, completed, user, and so on).

Once connected to the database, the API provides one json file to the frontend based on the email address of the user, which shows all the tasks and their status, and then multiple json files for deleting and modifying each of the tasks. Marking a task as completed or editing the content of the task is achieved by sending a patch request to the API. Instead of sending those requests directly, I am first using the Svelte store (similar to the React `useState` hook) for state management. This results in a better experience.

I am specifically checking if the user is authenticated (if the Auth0 cookie is present) and if the authentication email matches the one for the requests. If not, the json file is no longer accessible and you are redirected to the home page. This ensures that you can only read your own tasks, and that tasks cannot be read unless you are authenticated.

In addition, I am also checking if you are trying to create an empty task and will show an error if that happens.

I have used the native share functionality of iOS and Android since it is more customised for the user. It shows the most used social media and messaging apps by the specific user. Since it is not yet supported by all browsers and platforms, I have added a fallback function that will copy the content of the task to the clipboard instead. Both of those functionalities will show a popup afterward, notifying the user that the task has been shared.

For the styling, I have used sass, CSS variables, and PostCSS for processing. I have used hsl for the colors, since it looks better on more modern high resolution displays.

## Design

I have designed the app myself using some free resources. I based the color scheme on the two main colors I chose for the logo, and I went with various shades of grey for the rest of the UI. I have chosen Istok Web for the font. I have added animations for the creation of the tasks and when the tasks initially load on the page. I have tried to achieve as smooth of an experience as possible. I am specifically sending the requests a bit after the animation is shown to the user so as to not wait for the server to respond back and thus slow down the overall feel of the interaction.

I am using [Cloudinary](https://cloudinary.com/) to speed up the loading of the images and load them faster from a location closer to the user using a CDN.

## Development

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), you need to generate your Prisma client. I have added a "predev" script for that `npm run predev` that will generate the Prisma client in the node_modules folder. Then make sure your `.env` file is properly configured. You can find an example `.env.sample` file in the main directory of the project. 
You can then start a development server:
```bash
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. In my case, since I am using Vercel for the hosting, I went with the [vercel adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-vercel) that SvelteKit provides. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

