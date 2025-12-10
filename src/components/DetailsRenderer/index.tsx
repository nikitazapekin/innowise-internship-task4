import React from "react";
import styled from "@emotion/styled";

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

type DataType = "films" | "people" | "planets";

interface DetailsRendererProps {
  dataType: DataType;
  details: FilmDetails | PersonDetails | PlanetDetails | null;
}

const DetailsRenderer: React.FC<DetailsRendererProps> = ({ dataType, details }) => {
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
              {resident.name} {resident.species?.name && `(${resident.species.name})`}
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
              {film.title} ({film.releaseDate}) - {film.director}
            </ListItem>
          ))}
        </ItemsList>
      </InfoSection>
    )}
  </>
);
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

export default DetailsRenderer;
