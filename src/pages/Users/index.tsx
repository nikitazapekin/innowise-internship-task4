import type { FormEvent } from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { useInfiniteQuery } from "@tanstack/react-query";
import Error from "components/Error";
import Layout from "components/Layout";
import Loading from "components/Loading";
import SearchUsers from "components/SearchUsers";
import UserCard from "components/UserCard";
import { API_CONFIG, PER_PAGE_OPTIONS } from "constants/index";
import { createApiClient } from "helpers/createApiClient";

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

  const handleChangeQuery = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
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
            <SearchUsers
              searchQuery={searchQuery}
              handleChangeQuery={handleChangeQuery}
              handleSearch={handleSearch}
            />
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

          {isPending && <Loading text="Загрузка пользователей..." />}

          {status === "error" && <Error text="Что-то пошло не так..." />}

          {status === "success" && (
            <>
              <ResultsInfo>
                <ResultsCount>
                  {searchQuery
                    ? `Найдено: ${totalCount}  Загружено: ${allUsers.length}`
                    : `Загружено: ${allUsers.length}`}
                </ResultsCount>
              </ResultsInfo>

              {allUsers.length > 0 ? (
                <>
                  <UsersGrid>
                    {allUsers.map((user) => (
                      <UserCard user={user} key={user.id} />
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
  background-color: ${(props) => props.theme.colors.white};
`;

const Container = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spaces.md}px;
`;

const ControlsPanel = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spaces.sm}px;
  padding: ${(props) => props.theme.spaces.lg}px;
  background: ${(props) => props.theme.colors.white};
  border-radius: 16px;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
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
`;

const PerPageSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.sm}px;
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
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.md}px;
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
