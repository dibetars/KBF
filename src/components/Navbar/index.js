import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import MKBox from "components/MKBox";
import routes from "routes";
import { externalLinks } from "routes";

function Navbar() {
  return (
    <Container>
      <MKBox
        py={1}
        px={{ xs: 4, sm: 3, lg: 2 }}
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Internal Routes */}
        {routes.map((route) => (
          <Link
            key={route.name}
            to={route.route}
            style={{ textDecoration: "none" }}
          >
            <MKBox
              display="flex"
              alignItems="center"
              py={0.5}
              px={2}
            >
              {route.icon}
              <span style={{ marginLeft: "8px" }}>{route.name}</span>
            </MKBox>
          </Link>
        ))}

        {/* External Links */}
        {externalLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <MKBox
              display="flex"
              alignItems="center"
              py={0.5}
              px={2}
            >
              {link.icon}
              <span style={{ marginLeft: "8px" }}>{link.name}</span>
            </MKBox>
          </a>
        ))}
      </MKBox>
    </Container>
  );
}

export default Navbar; 