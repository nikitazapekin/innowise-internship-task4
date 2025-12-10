import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
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

interface FilmData {
  film: FilmDetails | null;
}

interface PersonData {
  person: PersonDetails | null;
}

interface PlanetData {
  planet: PlanetDetails | null;
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

  const getDetails = () => {
    if (!detailsData) return null;

    switch (dataType) {
      case "films":
        return (detailsData as FilmData)?.film;

      case "people":
        return (detailsData as PersonData)?.person;

      case "planets":
        return (detailsData as PlanetData)?.planet;

      default:
        return null;
    }
  };

  const renderDetails = () => {
    const details = getDetails();

    if (!details) return null;

    switch (dataType) {
      case "films":
        return renderFilmDetails(details as FilmDetails);

      case "people":
        return renderPersonDetails(details as PersonDetails);

      case "planets":
        return renderPlanetDetails(details as PlanetDetails);

      default:
        return null;
    }
  };

  const renderFilmDetails = (film: FilmDetails) => (
    <>
      <DetailsHeader>
        <DetailsName>{film.title}</DetailsName>
        <DetailsId>ID: {film.id}</DetailsId>
      </DetailsHeader>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Эпизод:</InfoLabel>
          <InfoValue>{film.episodeID}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Режиссер:</InfoLabel>
          <InfoValue>{film.director || "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Дата выхода:</InfoLabel>
          <InfoValue>{film.releaseDate || "Неизвестно"}</InfoValue>
        </InfoItem>
      </InfoGrid>

      {film.openingCrawl && (
        <InfoSection>
          <SectionTitle>Вступительный текст:</SectionTitle>
          <OpeningCrawl>{film.openingCrawl}</OpeningCrawl>
        </InfoSection>
      )}

      {film.producers && film.producers.length > 0 && (
        <InfoSection>
          <SectionTitle>Продюсеры:</SectionTitle>
          <TagsList>
            {film.producers.map((producer, index) => (
              <Tag key={index}>{producer}</Tag>
            ))}
          </TagsList>
        </InfoSection>
      )}

      {film.characterConnection?.characters && film.characterConnection.characters.length > 0 && (
        <InfoSection>
          <SectionTitle>Персонажи ({film.characterConnection.characters.length}):</SectionTitle>
          <ItemsList>
            {film.characterConnection.characters.map((character, index) => (
              <ListItem key={index}>
                {character.name} {character.species && `(${character.species.name})`}
              </ListItem>
            ))}
          </ItemsList>
        </InfoSection>
      )}

      {film.planetConnection?.planets && film.planetConnection.planets.length > 0 && (
        <InfoSection>
          <SectionTitle>Планеты ({film.planetConnection.planets.length}):</SectionTitle>
          <TagsList>
            {film.planetConnection.planets.map((planet, index) => (
              <Tag key={index}>{planet.name}</Tag>
            ))}
          </TagsList>
        </InfoSection>
      )}
    </>
  );

  const renderPersonDetails = (person: PersonDetails) => (
    <>
      <DetailsHeader>
        <DetailsName>{person.name}</DetailsName>
        <DetailsId>ID: {person.id}</DetailsId>
      </DetailsHeader>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Год рождения:</InfoLabel>
          <InfoValue>{person.birthYear || "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Пол:</InfoLabel>
          <InfoValue>{person.gender || "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Рост:</InfoLabel>
          <InfoValue>{person.height ? `${person.height}` : "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Вес:</InfoLabel>
          <InfoValue>{person.mass ? `${person.mass}` : "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Цвет глаз:</InfoLabel>
          <InfoValue>{person.eyeColor || "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Цвет волос:</InfoLabel>
          <InfoValue>{person.hairColor || "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Цвет кожи:</InfoLabel>
          <InfoValue>{person.skinColor || "Неизвестно"}</InfoValue>
        </InfoItem>
      </InfoGrid>

      {person.homeworld && (
        <InfoSection>
          <SectionTitle>Родная планета:</SectionTitle>
          <InfoValue>{person.homeworld.name}</InfoValue>
        </InfoSection>
      )}

      {person.filmConnection?.films && person.filmConnection.films.length > 0 && (
        <InfoSection>
          <SectionTitle>Фильмы ({person.filmConnection.films.length}):</SectionTitle>
          <TagsList>
            {person.filmConnection.films.map((film, index) => (
              <Tag key={index}>{film.title}</Tag>
            ))}
          </TagsList>
        </InfoSection>
      )}

      {person.starshipConnection?.starships && person.starshipConnection.starships.length > 0 && (
        <InfoSection>
          <SectionTitle>Корабли ({person.starshipConnection.starships.length}):</SectionTitle>
          <TagsList>
            {person.starshipConnection.starships.map((starship, index) => (
              <Tag key={index}>{starship.name}</Tag>
            ))}
          </TagsList>
        </InfoSection>
      )}
    </>
  );

  const renderPlanetDetails = (planet: PlanetDetails) => (
    <>
      <DetailsHeader>
        <DetailsName>{planet.name}</DetailsName>
        <DetailsId>ID: {planet.id}</DetailsId>
      </DetailsHeader>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Диаметр:</InfoLabel>
          <InfoValue>{planet.diameter ? `${planet.diameter} км` : "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Гравитация:</InfoLabel>
          <InfoValue>{planet.gravity || "Неизвестно"}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Население:</InfoLabel>
          <InfoValue>
            {planet.population ? planet.population.toLocaleString() : "Неизвестно"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Орбитальный период:</InfoLabel>
          <InfoValue>
            {planet.orbitalPeriod ? `${planet.orbitalPeriod} дней` : "Неизвестно"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Период вращения:</InfoLabel>
          <InfoValue>
            {planet.rotationPeriod ? `${planet.rotationPeriod} часов` : "Неизвестно"}
          </InfoValue>
        </InfoItem>
      </InfoGrid>

      {planet.climates && planet.climates.length > 0 && (
        <InfoSection>
          <SectionTitle>Климат:</SectionTitle>
          <TagsList>
            {planet.climates.map((climate, index) => (
              <Tag key={index}>{climate}</Tag>
            ))}
          </TagsList>
        </InfoSection>
      )}

      {planet.terrains && planet.terrains.length > 0 && (
        <InfoSection>
          <SectionTitle>Ландшафты:</SectionTitle>
          <TagsList>
            {planet.terrains.map((terrain, index) => (
              <Tag key={index}>{terrain}</Tag>
            ))}
          </TagsList>
        </InfoSection>
      )}

      {planet.residentConnection?.residents && planet.residentConnection.residents.length > 0 && (
        <InfoSection>
          <SectionTitle>Жители ({planet.residentConnection.residents.length}):</SectionTitle>
          <ItemsList>
            {planet.residentConnection.residents.map((resident, index) => (
              <ListItem key={index}>
                {resident.name} {`${resident?.species}`}
              </ListItem>
            ))}
          </ItemsList>
        </InfoSection>
      )}

      {planet.filmConnection?.films && planet.filmConnection.films.length > 0 && (
        <InfoSection>
          <SectionTitle>Фильмы ({planet.filmConnection.films.length}):</SectionTitle>
          <ItemsList>
            {planet.filmConnection.films.map((film, index) => (
              <ListItem key={index}>
                {film.title} ({film.releaseDate}) {film.director}
              </ListItem>
            ))}
          </ItemsList>
        </InfoSection>
      )}
    </>
  );

  if (listLoading) return <Loading text="Загрузка" />;

  if (listError) return <Error text="Что-то пошло не так" />;

  const items = getItems();

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

        {getDetails() && <DetailsContainer>{renderDetails()}</DetailsContainer>}

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

const GraphQLContainer = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  width: 100%;
  margin: 0 auto;
  padding: ${(props) => props.theme.spaces.lg}px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  background: ${(props) => props.theme.colors.light}10;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spaces.lg}px;
  padding-bottom: ${(props) => props.theme.spaces.md}px;
  border-bottom: 1px solid ${(props) => props.theme.colors.light};
`;

const DetailsName = styled.h3`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0;
`;

const DetailsId = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  color: ${(props) => props.theme.colors.secondary};
  background: ${(props) => props.theme.colors.light};
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border-radius: 4px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spaces.md}px;
  margin-bottom: ${(props) => props.theme.spaces.lg}px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.xxs}px;
`;

const InfoLabel = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  color: ${(props) => props.theme.colors.dark};
`;

const InfoSection = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.lg}px;
`;

const SectionTitle = styled.h4`
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.md}px;
  color: ${(props) => props.theme.colors.secondary};
  margin: 0 0 ${(props) => props.theme.spaces.sm}px 0;
`;

const OpeningCrawl = styled.div`
  font-style: italic;
  line-height: 1.6;
  padding: ${(props) => props.theme.spaces.sm}px;
  background: ${(props) => props.theme.colors.light}20;
  border-left: 4px solid ${(props) => props.theme.colors.primary};
  border-radius: 4px;
  white-space: pre-wrap;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spaces.sm}px;
`;

const Tag = styled.span`
  background: ${(props) => props.theme.colors.light};
  color: ${(props) => props.theme.colors.dark};
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border-radius: 4px;
  font-size: ${(props) => props.theme.fontSizes.xs}px;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spaces.sm}px;
`;

const ListItem = styled.div`
  padding: ${(props) => props.theme.spaces.sm}px;
  background: ${(props) => props.theme.colors.light}20;
  border-radius: 4px;
  font-size: ${(props) => props.theme.fontSizes.sm}px;
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
  background: ${(props) => props.theme.colors.danger}10;
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
