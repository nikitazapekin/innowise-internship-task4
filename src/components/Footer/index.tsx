import styled from "@emotion/styled";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <Container>
        <FooterContent>
          <Copyright>{currentYear} Emotion App.</Copyright>
        </FooterContent>
      </Container>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spaces.md}px 0;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Container = styled.div`
  max-width: ${(props) => props.theme.containers.md}px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spaces.sm}px;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Copyright = styled.p`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 auto;
`;

export default Footer;
