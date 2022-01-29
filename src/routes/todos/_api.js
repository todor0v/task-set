import PrismaClient from "$lib/prisma";

const prisma = new PrismaClient();

export const api = async (event, data) => {
  let body = {};
  let status = 500;

  switch (event.request.method.toUpperCase()) {
    case "GET":
      body = await prisma.todo.findMany({
        where: {
          user: event.params.user
        }
      });
      status = 200;
      break;
    case "POST":
      body = await prisma.todo.create({
        data: {
          created_at: data.created_at,
          completed: data.completed,
          description: data.description,
          user: data.user
        }
      })
      status = 201;
      break;
    case "DELETE":
      body = await prisma.todo.delete({
        where: {
          id: event.params.id
        }
      })
      status = 200;
      break;
    case "PATCH":
      body = await prisma.todo.update({
        where: {
          id: event.params.id
        },
        data: {
          completed: data.completed,
          // description: data.description
        }
      })
      status = 200;
      break;

    default:
      break;
  }

  // if (event.request.method.toUpperCase() !== "GET" &&
  // event.request.headers.accept !== "application/json") {
  //   return {
  //     status: 303,
  //     headers: {
  //       location: "/"
  //     }
  //   };
  // }

  return {
    status,
    body
  }
}