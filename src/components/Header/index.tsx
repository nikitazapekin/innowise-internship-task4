import { useState } from "react";
import styled from "@emotion/styled";
import { Link } from "@tanstack/react-router";
import { themeUtils } from "styles/theme";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <StyledHeader>
        <Container>
          <LogoContainer>
            <LogoLink to="/" onClick={closeMenu}>
              <LogoText>Emotion app</LogoText>
            </LogoLink>
          </LogoContainer>

          <BurgerButton
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            $isOpen={isMenuOpen}
          >
            <BurgerLine $isOpen={isMenuOpen} />
            <BurgerLine $isOpen={isMenuOpen} />
            <BurgerLine $isOpen={isMenuOpen} />
          </BurgerButton>

          <DesktopNav>
            <NavList>
              <NavItem>
                <NavLink to="/about" activeOptions={{ exact: true }} onClick={closeMenu}>
                  About
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/graphql" onClick={closeMenu}>
                  GraphQL
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/chat" onClick={closeMenu}>
                  WebSockets
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/users" onClick={closeMenu}>
                  REST API
                </NavLink>
              </NavItem>
            </NavList>
          </DesktopNav>
        </Container>
      </StyledHeader>

      <MobileNav $isOpen={isMenuOpen}>
        <MobileNavHeader>
          <MobileNavTitle>Меню</MobileNavTitle>
          <CloseButton onClick={closeMenu} aria-label="Закрыть меню">
            <CloseIcon>×</CloseIcon>
          </CloseButton>
        </MobileNavHeader>

        <MobileNavList>
          <NavItem>
            <MobileNavLink to="/about" activeOptions={{ exact: true }} onClick={closeMenu}>
              About
            </MobileNavLink>
          </NavItem>
          <NavItem>
            <MobileNavLink to="/graphql" onClick={closeMenu}>
              GraphQL
            </MobileNavLink>
          </NavItem>
          <NavItem>
            <MobileNavLink to="/chat" onClick={closeMenu}>
              WebSockets
            </MobileNavLink>
          </NavItem>
          <NavItem>
            <MobileNavLink to="/users" onClick={closeMenu}>
              REST API
            </MobileNavLink>
          </NavItem>
        </MobileNavList>
      </MobileNav>

      {isMenuOpen && <Overlay onClick={closeMenu} />}
    </>
  );
};

const { tablet } = themeUtils.mediaQueries;

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
  position: relative;
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

const BurgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1003;

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.main};
    outline-offset: 2px;
  }

  &:hover span {
    background-color: ${(props) => props.theme.colors.light};
  }

  ${tablet} {
    display: flex;
  }
`;

const BurgerLine = styled.span<{ $isOpen: boolean }>`
  display: block;
  width: 100%;
  height: 3px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 2px;
  transition: all 0.3s ease;

  &:nth-of-type(1) {
    transform-origin: top left;
    ${(props) =>
      props.$isOpen &&
      `
      transform: rotate(45deg) translate(2px, -1px);
    `}
  }

  &:nth-of-type(2) {
    opacity: 1;
    ${(props) =>
      props.$isOpen &&
      `
      opacity: 0;
      transform: translateX(-10px);
    `}
  }

  &:nth-of-type(3) {
    transform-origin: bottom left;
    ${(props) =>
      props.$isOpen &&
      `
      transform: rotate(-45deg) translate(2px, 1px);
    `}
  }
`;

const DesktopNav = styled.nav`
  ${tablet} {
    display: none;
  }
`;

const MobileNav = styled.nav<{ $isOpen: boolean }>`
  display: none;

  ${tablet} {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: ${(props) => (props.$isOpen ? "0" : "-100%")};
    width: 100%;
    height: 100vh;
    background-color: ${(props) => props.theme.colors.primary};
    transition: left 0.4s ease;
    z-index: 1001;
    box-shadow: none;
    overflow-y: auto;
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spaces.md}px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MobileNavTitle = styled.h2`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
  margin: 0;
`;

const CloseButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.white};
    outline-offset: 2px;
  }
`;

const CloseIcon = styled.span`
  font-size: 32px;
  color: ${(props) => props.theme.colors.white};
  line-height: 1;
`;

const NavList = styled.ul`
  display: flex;
  gap: ${(props) => props.theme.spaces.md}px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MobileNavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.sm}px;
  list-style: none;
  margin: 0;
  padding: ${(props) => props.theme.spaces.xl}px;
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
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.xxs}px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;

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

  ${tablet} {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  width: 100%;
  color: ${(props) => props.theme.colors.white};
  text-decoration: none;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  font-weight: 500;
  padding: ${(props) => props.theme.spaces.xxs}px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &[data-status="active"] {
    background-color: ${(props) => props.theme.colors.main};
    color: ${(props) => props.theme.colors.white};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: ${(props) => props.theme.colors.main};
      opacity: 0.9;
    }
  }
`;

const Overlay = styled.div`
  display: none;

  ${tablet} {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    backdrop-filter: blur(3px);
  }
`;

export default Header;
