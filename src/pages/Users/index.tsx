import type { FormEvent } from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { useInfiniteQuery } from "@tanstack/react-query";
import Layout from "components/Layout";
import { API_CONFIG, PER_PAGE_OPTIONS } from "constants/index";
import { createApiClient } from "helpers/createApiClient";
import { themeUtils } from "styles/theme";

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

const apiClient = createApiClient();

const Users = () => {
  const [perPage, setPerPage] = useState<number>(API_CONFIG.DEFAULT_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async ({
    pageParam = 0,
  }): Promise<{
    users: GitHubUser[];
    nextPage: number | null;
    total: number;
  }> => {
    let url: string;

    if (searchQuery) {
      url = `/search/users?q=${encodeURIComponent(searchQuery)}&page=${
        pageParam + 1
      }&per_page=${perPage}`;
    } else {
      url = `/users?since=${pageParam * perPage}&per_page=${perPage}`;
    }

    const data = await apiClient.fetch(url);

    if (searchQuery) {
      return {
        users: data.items,
        nextPage: data.items.length === perPage ? pageParam + 1 : null,
        total: data.total_count,
      };
    }

    return {
      users: data,
      nextPage: data.length === perPage ? pageParam + 1 : null,
      total: 0,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["githubUsers", perPage, searchQuery],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const allUsers = data?.pages.flatMap((page) => page.users) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    refetch();
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    refetch();
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Layout>
      <ContentSection>
        <Container>
          <ControlsPanel>
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Поиск пользователей GitHub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit" disabled={isPending}>
                {isPending ? "Поиск..." : "Поиск"}
              </SearchButton>
              {searchQuery && (
                <ClearButton type="button" onClick={handleClearSearch}>
                  Сброс
                </ClearButton>
              )}
            </SearchForm>

            <PerPageSelector>
              <PerPageLabel>Пользователей на странице:</PerPageLabel>
              <PerPageOptions>
                {PER_PAGE_OPTIONS.map((option) => (
                  <PerPageOption
                    key={option}
                    $isActive={perPage === option}
                    onClick={() => handlePerPageChange(option)}
                  >
                    {option}
                  </PerPageOption>
                ))}
              </PerPageOptions>
            </PerPageSelector>
          </ControlsPanel>

          {isPending && (
            <LoadingState>
              <Spinner />
              <LoadingText>Загрузка пользователей...</LoadingText>
            </LoadingState>
          )}

          {status === "error" && (
            <ErrorState>
              <ErrorMessage>Ошибка: {(error as Error).message}</ErrorMessage>
              <RetryButton onClick={() => refetch()}>Попробовать снова</RetryButton>
            </ErrorState>
          )}

          {status === "success" && (
            <>
              <ResultsInfo>
                <ResultsCount>
                  {searchQuery
                    ? `Найдено: ${totalCount} | Загружено: ${allUsers.length}`
                    : `Загружено: ${allUsers.length}`}
                </ResultsCount>
              </ResultsInfo>

              {allUsers.length > 0 ? (
                <>
                  <UsersGrid>
                    {allUsers.map((user) => (
                      <UserCard key={user.id} href={user.html_url}>
                        <UserAvatar src={user.avatar_url} alt={user.login} loading="lazy" />
                        <UserInfo>
                          <UserName>{user.login}</UserName>
                          <UserType>Тип: {user.type}</UserType>
                          {user.site_admin && <AdminBadge>Admin</AdminBadge>}
                        </UserInfo>
                      </UserCard>
                    ))}
                  </UsersGrid>

                  {hasNextPage && (
                    <LoadMoreWrapper>
                      <LoadMoreButton onClick={loadMore} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}
                      </LoadMoreButton>
                    </LoadMoreWrapper>
                  )}

                  {!hasNextPage && allUsers.length > 0 && (
                    <EndMessage>Вы достигли конца списка</EndMessage>
                  )}
                </>
              ) : (
                <EmptyState>
                  <EmptyMessage>
                    {searchQuery ? "Пользователи не найдены" : "Пользователи отсутствуют"}
                  </EmptyMessage>
                </EmptyState>
              )}
            </>
          )}
        </Container>
      </ContentSection>
    </Layout>
  );
};

const ContentSection = styled.section`
  padding: ${(props) => props.theme.spaces.xl}px 0;
  background-color: ${(props) => props.theme.colors.white};
`;

const Container = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spaces.md}px;

  ${themeUtils.mediaQueries.tablet} {
    padding: 0 ${(props) => props.theme.spaces.lg}px;
  }
`;

const ControlsPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spaces.sm}px;
  padding: ${(props) => props.theme.spaces.lg}px;
  background: ${(props) => props.theme.colors.white};
  border-radius: 16px;

  backdrop-filter: blur(10px);

  ${themeUtils.mediaQueries.tabletUp} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${(props) => props.theme.spaces.sm}px;
  flex: 1;
  max-width: 600px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 12px;
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  transition: all 0.3s ease;
  background: ${(props) => props.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.main};
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.main};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const BaseButton = styled.button`
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border: none;
  border-radius: 12px;
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spaces.xxs}px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const SearchButton = styled(BaseButton)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.main},
    ${(props) => props.theme.colors.main}
  );
  color: ${(props) => props.theme.colors.white};
  min-width: 100px;

  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.dark},
      ${(props) => props.theme.colors.main}
    );
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.main};
  }
`;

const ClearButton = styled(BaseButton)`
  background: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.secondary};
  border: 1px solid ${(props) => props.theme.colors.secondary};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.secondary};
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.secondary};
  }
`;

const PerPageSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.sm}px;

  ${themeUtils.mediaQueries.tabletUp} {
    flex-direction: row;
    align-items: center;
  }
`;

const PerPageLabel = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
  white-space: nowrap;
`;

const PerPageOptions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spaces.xxs}px;
  flex-wrap: wrap;
`;

interface PerPageOptionProps {
  $isActive: boolean;
}

const PerPageOption = styled.button<PerPageOptionProps>`
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid
    ${(props) => (props.$isActive ? props.theme.colors.main : props.theme.colors.light)};
  background: ${(props) => (props.$isActive ? props.theme.colors.main : props.theme.colors.white)};
  color: ${(props) => (props.$isActive ? props.theme.colors.white : props.theme.colors.secondary)};

  &:hover {
    border-color: ${(props) => props.theme.colors.main};
    color: ${(props) => props.theme.colors.main};
    transform: translateY(-1px);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spaces.xxxl}px;
  gap: ${(props) => props.theme.spaces.lg}px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${(props) => props.theme.colors.light};
  border-top: 4px solid ${(props) => props.theme.colors.main};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spaces.xxxl}px;
  gap: ${(props) => props.theme.spaces.lg}px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.danger};
  font-weight: 500;
  max-width: 600px;
`;

const RetryButton = styled(BaseButton)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.danger},
    ${(props) => props.theme.colors.danger}
  );
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spaces.sm}px ${(props) => props.theme.spaces.lg}px;
`;

const ResultsInfo = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.xl}px;
  padding: ${(props) => props.theme.spaces.md}px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.black};
`;

const ResultsCount = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
  text-align: center;
  margin: 0;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${(props) => props.theme.spaces.sm}px;

  ${themeUtils.mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }

  ${themeUtils.mediaQueries.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const UserCard = styled.a`
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

const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${(props) => props.theme.spaces.xl}px 0;
`;

const LoadMoreButton = styled(BaseButton)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.main},
    ${(props) => props.theme.colors.main}
  );
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spaces.md}px ${(props) => props.theme.spaces.xl}px;
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  min-width: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spaces.xxxl}px;
  text-align: center;
`;

const EmptyMessage = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
  margin: 0;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spaces.xl}px;
  color: ${(props) => props.theme.colors.secondary};
  font-style: italic;
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  border-top: 1px solid ${(props) => props.theme.colors.light};
  margin-top: ${(props) => props.theme.spaces.xl}px;
`;

export default Users;
