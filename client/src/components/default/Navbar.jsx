import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { images } from "../../assets/Assets";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const products = [
    {
      title: "Alert Dialog",
      href: "/products",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
  ];
  const services = [
    {
      title: "Alert Dialog",
      href: "/services",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
  ];
  return (
    <nav className="w-full bg-white sticky top-0 shadow">
      <div className="w-[80vw] mx-auto flex justify-between py-3">
        <img src={images.logo} className="h-10" alt="" />
        <NavigationMenu>
          <NavigationMenuList>
            {/* about us */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/about">
                        <img src={images.logo} className="pr-6" alt="" />
                        <div className="mb-2 mt-4 text-[15px] font-medium">
                          GW Infra Solutions
                        </div>
                        <p className="text-[13px] leading-tight text-muted-foreground">
                          specializes in cutting-edge solar PV installations,
                          delivering sustainable energy solutions tailored for
                          residential, commercial, and industrial needs.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/about" title="Channel Partner">
                    Collaborating with trusted partners to deliver high-quality,
                    efficient, and innovative solar energy solutions.
                  </ListItem>
                  <ListItem href="/about" title="Licence">
                    Guidelines on obtaining licenses and compliance standards
                    for solar energy projects, ensuring smooth and legal
                    installations.
                  </ListItem>
                  <ListItem href="/about" title="Awards">
                    Recognition for our excellence in delivering sustainable
                    energy solutions and commitment to environmental impact.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* products */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {products.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* services */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {services.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* news and updates */}
            <NavigationMenuItem>
              <Link to="/update" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  News & Updates
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* events */}
            <NavigationMenuItem>
              <Link to="/events" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* contact us */}
            <NavigationMenuItem>
              <Link to="/contact" legacyBehavior passHref>
                <Button variant="default">Contact Us</Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;

const ListItem = React.forwardRef(function ListItem(
  { className, title, children, ...props },
  ref
) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
