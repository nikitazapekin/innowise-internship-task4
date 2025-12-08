import styled from "@emotion/styled";
import Layout from "components/Layout";
import { themeUtils } from "styles/theme";

const User = () => {
  return (
    <Layout>
      <HeroSection>
        <Container>
          <HeroContent>
            <Title>
              Добро пожаловать {""}
              <Highlight>в</Highlight> EmotionApp
            </Title>
            <Description>Опробуй наши решения с GraphQl и WebSockets!</Description>
          </HeroContent>
        </Container>
      </HeroSection>
    </Layout>
  );
};

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.white} 0%,
    ${(props) => props.theme.colors.light}15 100%
  );
  padding: ${(props) => props.theme.spaces.xxxl}px 0;
  min-height: 80vh;
  display: flex;
  align-items: center;

  ${themeUtils.mediaQueries.tablet} {
    padding: ${(props) => props.theme.spaces.xxl}px 0;
  }
`;

const Container = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spaces.md}px;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.theme.spaces.xxl}px;
  align-items: center;
  justify-content: center;
  text-align: center;

  ${themeUtils.mediaQueries.tablet} {
    gap: ${(props) => props.theme.spaces.xl}px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spaces.md}px;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.lg + 8}px;
  color: ${(props) => props.theme.colors.primary};
  line-height: 1.2;
  margin: 0;

  ${themeUtils.mediaQueries.tablet} {
    font-size: ${(props) => props.theme.fontSizes.lg}px;
  }

  ${themeUtils.mediaQueries.mobile} {
    font-size: ${(props) => props.theme.fontSizes.md}px;
  }
`;

const Highlight = styled.span`
  color: ${(props) => props.theme.colors.main};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 0;
    width: 100%;
    height: 6px;
    background-color: ${(props) => props.theme.colors.light}40;
    z-index: -1;
    border-radius: 3px;
  }
`;

const Description = styled.p`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  line-height: 1.6;
  margin: 0;

  ${themeUtils.mediaQueries.mobile} {
    font-size: ${(props) => props.theme.fontSizes.xxs}px;
  }
`;

export default User;
