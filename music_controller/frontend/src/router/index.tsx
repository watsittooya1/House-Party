// https://dev.to/franciscomendes10866/file-based-routing-using-vite-and-react-router-3fdo

import type { JSX } from "react";
import type { RouteObject } from "react-router-dom";

type CustomRouteObject = Omit<RouteObject, "children"> & {
  children?: { [key: string]: CustomRouteObject };
};

type PageConfigObj = {
  [key: string]: CustomRouteObject;
};

type PageConfiguration = {
  default: () => JSX.Element;
  path: string;
  element: React.ReactNode;
  children: PageConfigObj;
};

const pages = import.meta.glob<true, string, PageConfiguration>(
  "./../pages/**/*.tsx",
  { eager: true }
);

const fileBasedRoutes: PageConfigObj = {};
for (const path of Object.keys(pages)) {
  const urlPath = path.replace("../pages/", "").replace(".tsx", "").split("/");

  const fileName = urlPath[urlPath.length - 1];

  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  // the component assigned to the element must be the default export of the page

  // Get the location of the nested path
  let current = fileBasedRoutes;
  for (const p of urlPath.slice(0, -1)) {
    // find the parent folder
    if (current[p] == null) {
      current[p] = { path: `/${p}` };
    }

    if (current[p].children == null) {
      current[p].children = {};
    }

    current = current[p].children as PageConfigObj;
  }

  const Element = pages[path].default;

  current[fileName] = {
    ...current[fileName],
    // index is used for nested index paths; leave as false for the base route "/"
    index: fileName === "index" && urlPath.length > 1,
    path: fileName === "index" ? `` : `${normalizedPathName.toLowerCase()}`,
    element: <Element />,
  };
}

function traverse(paths: CustomRouteObject[]): RouteObject[] {
  for (const path of paths) {
    if (path.children) {
      (path as RouteObject).children = traverse(Object.values(path.children));
    }
  }

  return paths as RouteObject[];
}

export const routes = traverse(Object.values(fileBasedRoutes));

console.log(routes);
