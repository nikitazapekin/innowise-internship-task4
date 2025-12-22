import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Error from "components/Error";
import Layout from "components/Layout";
import Loading from "components/Loading";
import { createApiClient } from "helpers/index";
import { themeUtils } from "styles/theme";

interface UserProps {
  username: string;
}

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

const apiClient = createApiClient();

const User = ({ username }: UserProps) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<GitHubUser>({
    queryKey: ["githubUser", username],
    queryFn: () => apiClient.fetch(`/users/${username}`),
  });

  return (
    <Layout>
      <HeroSection>
        <Container>
          {isLoading && <Loading text="Загрузка пользователя..." />}

          {isError && <Error text="Что-то пошло не так" />}

          {user && (
            <UserProfile>
              <UserAvatar src={user.avatar_url} alt={user.login} />
              <UserInfo>
                <UserName>{user.name || user.login}</UserName>
                <UserLogin>@{user.login}</UserLogin>

                {user.bio && <UserBio>{user.bio}</UserBio>}

                <UserStats>
                  <StatItem>
                    <StatNumber>{user.public_repos}</StatNumber>
                    <StatLabel>Репозитории</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{user.followers}</StatNumber>
                    <StatLabel>Подписчики</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{user.following}</StatNumber>
                    <StatLabel>Подписки</StatLabel>
                  </StatItem>
                </UserStats>

                <UserDetails>
                  {user.company && (
                    <DetailItem>
                      <DetailText>{user.company}</DetailText>
                    </DetailItem>
                  )}

                  {user.location && (
                    <DetailItem>
                      <DetailText>{user.location}</DetailText>
                    </DetailItem>
                  )}

                  {user.email && (
                    <DetailItem>
                      <DetailText>{user.email}</DetailText>
                    </DetailItem>
                  )}

                  {user.blog && (
                    <DetailItem>
                      <DetailText>{user.blog}</DetailText>
                    </DetailItem>
                  )}

                  {user.twitter_username && (
                    <DetailItem>
                      <DetailText>{user.twitter_username}</DetailText>
                    </DetailItem>
                  )}
                </UserDetails>

                <UserDates>
                  <DateItem>Создан: {user.created_at}</DateItem>
                  <DateItem>Обновлён: {user.updated_at}</DateItem>
                </UserDates>

                <Link to={user.html_url}>
                  <ProfileLink>Открыть профиль на GitHub</ProfileLink>
                </Link>
              </UserInfo>
            </UserProfile>
          )}
        </Container>
      </HeroSection>
    </Layout>
  );
};
const { smallLaptop, mobile } = themeUtils.mediaQueries;

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.white} 0%,
    ${(props) => props.theme.colors.light}15 100%
  );
  padding: ${(props) => props.theme.spaces.sm}px 0;

  display: flex;
  align-items: center;
`;

const Container = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spaces.md}px;
`;

const UserProfile = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${(props) => props.theme.spaces.sm}px;
  align-items: start;
  background: ${(props) => props.theme.colors.white};
  border-radius: 20px;
  padding: ${(props) => props.theme.spaces.xl}px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  ${smallLaptop} {
    padding: ${(props) => props.theme.spaces.sm}px;

    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const UserAvatar = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${(props) => props.theme.colors.light};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.sm}px;
`;

const UserName = styled.h1`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.lg + 8}px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0;

  ${smallLaptop} {
    text-align: center;
  }
`;

const UserLogin = styled.h2`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.md}px;
  color: ${(props) => props.theme.colors.secondary};
  margin: 0;

  ${smallLaptop} {
    text-align: center;
  }
`;

const UserBio = styled.p`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  color: ${(props) => props.theme.colors.secondary};
  line-height: 1.6;
  margin: ${(props) => props.theme.spaces.sm}px 0;
`;

const UserStats = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spaces.lg}px;

  ${smallLaptop} {
    justify-content: center;
    gap: ${(props) => props.theme.spaces.sm}px;
  }

  ${mobile} {
    flex-direction: column;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spaces.xxs}px;
`;

const StatNumber = styled.span`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.lg}px;
  color: ${(props) => props.theme.colors.main};
`;

const StatLabel = styled.span`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: ${(props) => props.theme.colors.secondary};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.sm}px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spaces.sm}px;
  color: ${(props) => props.theme.colors.secondary};
`;

const DetailText = styled.span`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xs}px;
`;

const UserDates = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.xxs}px;
`;

const DateItem = styled.span`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: ${(props) => props.theme.colors.secondary}80;
`;

const ProfileLink = styled.p`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  padding: ${(props) => props.theme.spaces.sm}px ${(props) => props.theme.spaces.lg}px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.main},
    ${(props) => props.theme.colors.main}
  );
  color: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  align-self: flex-start;
  margin-top: ${(props) => props.theme.spaces.md}px;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

export default User;
