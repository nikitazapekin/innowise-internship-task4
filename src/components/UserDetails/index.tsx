import styled from "@emotion/styled";
import { Link } from "@tanstack/react-router";

interface GitHubUser {
  user: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
  };
}

const UserDetails = ({ user }: GitHubUser) => {
  return (
    <Link to="/users/$username" params={{ username: user.login }}>
      <Wrapper key={user.id}>
        <UserAvatar src={user.avatar_url} alt={user.login} loading="lazy" />
        <UserInfo>
          <UserName>{user.login}</UserName>
          <UserType>Тип: {user.type}</UserType>
          {user.site_admin && <AdminBadge>Admin</AdminBadge>}
        </UserInfo>
      </Wrapper>
    </Link>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spaces.lg}px;
  background: ${(props) => props.theme.colors.white};
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.light};
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${(props) => props.theme.colors.main},
      ${(props) => props.theme.colors.light}
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px ${(props) => props.theme.colors.light};
    border-color: ${(props) => props.theme.colors.main}50;

    &::before {
      opacity: 1;
    }
  }
`;

const UserAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: ${(props) => props.theme.spaces.md}px;
  border: 4px solid ${(props) => props.theme.colors.light};
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const UserInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const UserName = styled.h3`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0 0 ${(props) => props.theme.spaces.xxs}px 0;
  font-weight: 700;
  line-height: 1.3;
`;

const UserType = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: ${(props) => props.theme.colors.secondary};
  margin: 0 0 ${(props) => props.theme.spaces.xxs}px 0;
  font-weight: 500;
`;

const AdminBadge = styled.span`
  display: inline-block;
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.success}20,
    ${(props) => props.theme.colors.success}10
  );
  color: ${(props) => props.theme.colors.success};
  border-radius: 20px;
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  font-weight: 700;
  border: 1px solid ${(props) => props.theme.colors.success};
  margin-top: ${(props) => props.theme.spaces.xxs}px;
`;

export default UserDetails;
