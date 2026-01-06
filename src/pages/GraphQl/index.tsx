import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import DetailsRenderer from "components/DetailsRenderer";
import Error from "components/Error";
import Layout from "components/Layout";
import Loading from "components/Loading";
import {
  GET_ALL_FILMS,
  GET_ALL_PEOPLE,
  GET_ALL_PLANETS,
  GET_FILM_BY_ID,
  GET_PERSON_BY_ID,
  GET_PLANET_BY_ID,
} from "queries/queries";
import { themeUtils } from "styles/theme";

type DataType = "films" | "people" | "planets";

interface BaseItem {
  id: string;
  name?: string;
  title?: string;
}

interface Film extends BaseItem {
  title: string;
  episodeID: number;
  releaseDate: string;
}

interface Person extends BaseItem {
  name: string;
  birthYear: string;
  gender: string;
}

interface Planet extends BaseItem {
  name: string;
  population: number | null;
  diameter: number | null;
}

interface AllFilmsData {
  allFilms: {
    films: Film[];
  };
}

interface AllPeopleData {
  allPeople: {
    people: Person[];
  };
}

interface AllPlanetsData {
  allPlanets: {
    planets: Planet[];
  };
}

interface FilmDataResponse {
  film: FilmDetails | null;
}

interface PersonDataResponse {
  person: PersonDetails | null;
}

interface PlanetDataResponse {
  planet: PlanetDetails | null;
}

interface FilmDetails {
  id: string;
  title: string;
  episodeID: number | null;
  openingCrawl: string | null;
  director: string | null;
  producers: string[] | null;
  releaseDate: string | null;
  characterConnection: {
    characters: Array<{
      name: string;
      species: {
        name: string;
      } | null;
    }>;
  } | null;
  planetConnection: {
    planets: Array<{
      name: string;
    }>;
  } | null;
}

interface PersonDetails {
  id: string;
  name: string;
  birthYear: string | null;
  eyeColor: string | null;
  gender: string | null;
  hairColor: string | null;
  height: number | null;
  mass: number | null;
  skinColor: string | null;
  homeworld: {
    name: string;
  } | null;
  filmConnection: {
    films: Array<{
      title: string;
    }>;
  } | null;
  starshipConnection: {
    starships: Array<{
      name: string;
    }>;
  } | null;
}

interface PlanetDetails {
  id: string;
  name: string;
  climates: string[] | null;
  diameter: number | null;
  gravity: string | null;
  orbitalPeriod: number | null;
  population: number | null;
  rotationPeriod: number | null;
  surfaceWater: number | null;
  terrains: string[] | null;
  residentConnection: {
    residents: Array<{
      name: string;
      species: {
        name: string;
      } | null;
    }>;
  } | null;
  filmConnection: {
    films: Array<{
      title: string;
      director: string | null;
      releaseDate: string | null;
    }>;
  } | null;
}

function GraphQl() {
  const [dataType, setDataType] = useState<DataType>("films");
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");

  const getListQueryConfig = () => {
    switch (dataType) {
      case "films":
        return { query: GET_ALL_FILMS, type: "films" };

      case "people":
        return { query: GET_ALL_PEOPLE, type: "people" };

      case "planets":
        return { query: GET_ALL_PLANETS, type: "planets" };

      default:
        return { query: GET_ALL_FILMS, type: "films" };
    }
  };

  const getDetailsQueryConfig = () => {
    switch (dataType) {
      case "films":
        return { query: GET_FILM_BY_ID, type: "film" };

      case "people":
        return { query: GET_PERSON_BY_ID, type: "person" };

      case "planets":
        return { query: GET_PLANET_BY_ID, type: "planet" };

      default:
        return { query: GET_FILM_BY_ID, type: "film" };
    }
  };

  const listConfig = getListQueryConfig();
  const detailsConfig = getDetailsQueryConfig();

  const {
    loading: listLoading,
    error: listError,
    data: listData,
  } = useQuery(listConfig.query, {
    skip: false,
  });

  const {
    loading: detailsLoading,
    error: detailsError,
    data: detailsData,
  } = useQuery(detailsConfig.query, {
    variables: { id: selectedId },
    skip: !selectedId,
  });

  const handleDataTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as DataType;

    setDataType(newType);
    setSelectedId("");
    setSearchId("");
  };

  const handleItemSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const itemId = e.target.value;

    setSelectedId(itemId);
  };

  const handleSearchIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (searchId.trim()) {
      setSelectedId(searchId.trim());
    }
  };

  const getDataTypeLabel = (type: DataType): string => {
    const labels: Record<DataType, string> = {
      films: "Фильмы",
      people: "Персонажи",
      planets: "Планеты",
    };

    return labels[type];
  };

  const getItems = (): BaseItem[] => {
    if (!listData) return [];

    switch (dataType) {
      case "films":
        return (listData as AllFilmsData)?.allFilms?.films || [];

      case "people":
        return (listData as AllPeopleData)?.allPeople?.people || [];

      case "planets":
        return (listData as AllPlanetsData)?.allPlanets?.planets || [];

      default:
        return [];
    }
  };

  const getDetails = (): FilmDetails | PersonDetails | PlanetDetails | null => {
    if (!detailsData) return null;

    switch (dataType) {
      case "films":
        return (detailsData as FilmDataResponse)?.film || null;

      case "people":
        return (detailsData as PersonDataResponse)?.person || null;

      case "planets":
        return (detailsData as PlanetDataResponse)?.planet || null;

      default:
        return null;
    }
  };

  if (listLoading) return <Loading text="Загрузка" />;

  if (listError) return <Error text="Что-то пошло не так" />;

  const items = getItems();
  const details = getDetails();

  return (
    <Layout>
      <GraphQLContainer>
        <GraphQLHeader>
          <GraphQLTitle>Star Wars GraphQL</GraphQLTitle>
        </GraphQLHeader>

        <ControlsSection>
          <DataTypeSection>
            <SelectLabel>Тип данных:</SelectLabel>
            <DataTypeSelect value={dataType} onChange={handleDataTypeChange}>
              <option value="films">Фильмы</option>
              <option value="people">Персонажи</option>
              <option value="planets">Планеты</option>
            </DataTypeSelect>
          </DataTypeSection>

          <SelectSection>
            <SelectLabel>Выберите элемент:</SelectLabel>
            <ItemSelect value={selectedId} onChange={handleItemSelect}>
              <option value="">Выберите {getDataTypeLabel(dataType).toLowerCase()}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name || item.title || item.id}
                </option>
              ))}
            </ItemSelect>
          </SelectSection>

          <SearchSection>
            <SearchForm onSubmit={handleSearchSubmit}>
              <SearchInput
                type="text"
                value={searchId}
                onChange={handleSearchIdChange}
                placeholder={`Введите ID ${getDataTypeLabel(dataType).toLowerCase()}`}
              />
              <SearchButton type="submit">Найти по ID</SearchButton>
            </SearchForm>
          </SearchSection>
        </ControlsSection>

        {detailsError && (
          <ErrorMessage>Ошибка при загрузке данных: {detailsError.message}</ErrorMessage>
        )}

        {detailsLoading && selectedId && (
          <LoadingMessage>Загрузка детальной информации</LoadingMessage>
        )}

        {details && (
          <DetailsContainer>
            <DetailsRenderer dataType={dataType} details={details} />
          </DetailsContainer>
        )}

        {!selectedId && !detailsLoading && (
          <EmptyState>
            Выберите элемент из списка или введите ID для просмотра информации
          </EmptyState>
        )}

        <InfoFooter>
          <InfoText>
            Всего {getDataTypeLabel(dataType).toLowerCase()}: {items.length}
          </InfoText>
          <InfoText>API: SWAPI GraphQL</InfoText>
        </InfoFooter>
      </GraphQLContainer>
    </Layout>
  );
}

const { tablet } = themeUtils.mediaQueries;
const GraphQLContainer = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  width: 100%;
  margin: 0 auto;
  padding: ${(props) => props.theme.spaces.lg}px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  ${tablet} {
    padding: ${(props) => props.theme.spaces.sm}px;
  }
`;

const GraphQLHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spaces.sm}px;
  padding-bottom: ${(props) => props.theme.spaces.md}px;
  border-bottom: 2px solid ${(props) => props.theme.colors.light};
`;

const GraphQLTitle = styled.h2`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.lg}px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.md}px;
  margin-bottom: ${(props) => props.theme.spaces.lg}px;
`;

const DataTypeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.xxs}px;
`;

const DataTypeSelect = styled.select`
  padding: ${(props) => props.theme.spaces.xxs}px;
  border: 2px solid ${(props) => props.theme.colors.light};
  border-radius: 8px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  background-color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const SelectSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.xxs}px;
`;

const SelectLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.secondary};
`;

const ItemSelect = styled.select`
  padding: ${(props) => props.theme.spaces.xxs}px;
  border: 2px solid ${(props) => props.theme.colors.light};
  border-radius: 8px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  background-color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.xxs}px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${(props) => props.theme.spaces.sm}px;

  ${tablet} {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${(props) => props.theme.spaces.xxs}px;
  border: 2px solid ${(props) => props.theme.colors.light};
  border-radius: 8px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.md}px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 8px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark};
  }
`;

const DetailsContainer = styled.div`
  margin-top: ${(props) => props.theme.spaces.lg}px;
  padding: ${(props) => props.theme.spaces.md}px;
  border: 2px solid ${(props) => props.theme.colors.light};
  border-radius: 8px;

  ${tablet} {
    padding: ${(props) => props.theme.spaces.sm}px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spaces.xl}px;
  color: ${(props) => props.theme.colors.secondary};
  font-size: ${(props) => props.theme.fontSizes.md}px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spaces.md}px;
  color: ${(props) => props.theme.colors.danger};
  background: ${(props) => props.theme.colors.danger};
  border-radius: 8px;
  margin: ${(props) => props.theme.spaces.md}px 0;
  font-size: ${(props) => props.theme.fontSizes.sm}px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spaces.xl}px;
  color: ${(props) => props.theme.colors.secondary};
  font-size: ${(props) => props.theme.fontSizes.md}px;
  border: 2px dashed ${(props) => props.theme.colors.light};
  border-radius: 8px;
  margin: ${(props) => props.theme.spaces.lg}px 0;
`;

const InfoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${(props) => props.theme.spaces.md}px;
  border-top: 1px solid ${(props) => props.theme.colors.light};
  margin-top: ${(props) => props.theme.spaces.lg}px;
`;

const InfoText = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
`;

export default GraphQl;
