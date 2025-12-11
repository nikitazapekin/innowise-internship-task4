import styled from "@emotion/styled";
import Layout from "components/Layout";
import { themeUtils } from "styles/theme";

const AboutPage = () => {
  return (
    <Layout>
      <HeroSection>
        <Container>
          <HeroContent>
            <Title>
              Мы
              <Highlight>-</Highlight>EmotionApp
            </Title>
            <Description>
              Современное приложение для тестирования взаимодействия клиента с сервером!
            </Description>

            <AboutDescription>
              Приложение позволяет опробовать различные технологии:
            </AboutDescription>

            <FeaturesList>
              <FeatureItem>
                <Strong> REST API</Strong> - классический подход к созданию веб-сервисов
              </FeatureItem>
              <FeatureItem>
                <Strong>GraphQL</Strong> - современный язык запросов для API с гибким получением
                данных
              </FeatureItem>
              <FeatureItem>
                <Strong>WebSockets</Strong> - технология для двустороннего обмена данными в реальном
                времени
              </FeatureItem>
            </FeaturesList>
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
  gap: ${(props) => props.theme.spaces.sm}px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.lg + 8}px;
  color: ${(props) => props.theme.colors.primary};
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

  margin: 0;
  font-weight: 500;

  ${themeUtils.mediaQueries.mobile} {
    font-size: ${(props) => props.theme.fontSizes.xxs}px;
  }
`;

const AboutDescription = styled.p`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  margin: ${(props) => props.theme.spaces.sm}px 0;
  max-width: 600px;
  text-align: center;

  ${themeUtils.mediaQueries.mobile} {
    font-size: ${(props) => props.theme.fontSizes.xxs}px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
  max-width: 600px;
  width: 100%;
`;

const FeatureItem = styled.li`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: ${(props) => props.theme.spaces.xxs}px;
  padding-left: ${(props) => props.theme.spaces.sm}px;

  ${themeUtils.mediaQueries.mobile} {
    font-size: 16px;
    padding-left: 0;
  }
`;
const Strong = styled.p`
  color: ${(props) => props.theme.colors.main};
  font-weight: 600;
`;

export default AboutPage;
