import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),

  route(":name/:value", "./routes/$name.$value.tsx", [
    route("og", "./routes/$name.$value.og.tsx"),
  ]),

  route("api", "./routes/api._index.tsx", [
    route(":name/:value", "./routes/api.$name.$value.tsx"),
  ]),
] satisfies RouteConfig;
