import { gql } from "@apollo/client";

export const GET_ALL_FILMS = gql`
  query GetAllFilms {
    allFilms {
      films {
        id
        title
        episodeID
        releaseDate
      }
    }
  }
`;

export const GET_ALL_PEOPLE = gql`
  query GetAllPeople {
    allPeople {
      people {
        id
        name
        birthYear
        gender
      }
    }
  }
`;

export const GET_ALL_PLANETS = gql`
  query GetAllPlanets {
    allPlanets {
      planets {
        id
        name
        population
        diameter
      }
    }
  }
`;

export const GET_FILM_BY_ID = gql`
  query GetFilm($id: ID!) {
    film(id: $id) {
      id
      title
      episodeID
      openingCrawl
      director
      producers
      releaseDate
      characterConnection {
        characters {
          name
          species {
            name
          }
        }
      }
      planetConnection {
        planets {
          name
        }
      }
    }
  }
`;

export const GET_PERSON_BY_ID = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      name
      birthYear
      eyeColor
      gender
      hairColor
      height
      mass
      skinColor
      homeworld {
        name
      }
      filmConnection {
        films {
          title
        }
      }
      starshipConnection {
        starships {
          name
        }
      }
    }
  }
`;

export const GET_PLANET_BY_ID = gql`
  query GetPlanet($id: ID!) {
    planet(id: $id) {
      id
      name
      climates
      diameter
      gravity
      orbitalPeriod
      population
      rotationPeriod
      surfaceWater
      terrains
      residentConnection {
        residents {
          name
          species {
            name
          }
        }
      }
      filmConnection {
        films {
          title
          director
          releaseDate
        }
      }
    }
  }
`;
