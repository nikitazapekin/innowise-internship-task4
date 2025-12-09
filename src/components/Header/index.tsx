import styled from "@emotion/styled";
import { Link } from "@tanstack/react-router";

const Header = () => {
  return (
    <StyledHeader>
      <Container>
        <LogoContainer>
          <LogoLink to="/">
            <LogoText>Emotion app</LogoText>
          </LogoLink>
        </LogoContainer>

        <Nav>
          <NavList>
            <NavItem>
              <NavLink to="/about" activeOptions={{ exact: true }}>
                About
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/graphql">GraphQL</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/chat">WebSockets</NavLink>
            </NavItem>
          </NavList>
        </Nav>
      </Container>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spaces.sm}px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  max-width: ${(props) => props.theme.containers.md}px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spaces.sm}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: baseline;
  gap: ${(props) => props.theme.spaces.xxs}px;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const LogoText = styled.span`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
`;

const Nav = styled.nav``;

const NavList = styled.ul`
  display: flex;
  gap: ${(props) => props.theme.spaces.md}px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  color: ${(props) => props.theme.colors.white};
  text-decoration: none;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  font-weight: 500;
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &[data-status="active"] {
    background-color: ${(props) => props.theme.colors.main};
    color: ${(props) => props.theme.colors.white};

    &::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: ${(props) => props.theme.colors.white};
      border-radius: 50%;
    }
  }
`;

export default Header;
