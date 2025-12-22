import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import styled from "@emotion/styled";
import { themeUtils } from "styles/theme";

interface SearchUsersProps {
  handleSearch: (e: FormEvent) => void;
  handleChangeQuery: (value: string) => void;
  searchQuery: string;
}

const SearchUsers = ({ handleChangeQuery, handleSearch }: SearchUsersProps) => {
  const [query, setQuery] = useState("");
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      handleChangeQuery(value);
    }, 300);
  };

  return (
    <SearchForm onSubmit={handleSearch}>
      <SearchInput
        type="text"
        placeholder="Поиск пользователей GitHub..."
        value={query}
        onChange={handleInputChange}
      />
      <SearchButton type="submit">Поиск</SearchButton>
    </SearchForm>
  );
};

const { tablet, smallLaptop } = themeUtils.mediaQueries;

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

const SearchButton = styled(BaseButton)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.main},
    ${(props) => props.theme.colors.main}
  );
  color: ${(props) => props.theme.colors.white};
  min-width: 100px;
  ${tablet} {
    align-self: center;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${(props) => props.theme.spaces.sm}px;
  flex: 1;
  max-width: 600px;
  align-self: flex-end;

  ${smallLaptop} {
    align-self: center;
    max-width: 100%;
    width: 100%;
  }
  ${tablet} {
    flex-direction: column;
  }
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
  ${tablet} {
    min-width: 200px;
  }
`;

export default SearchUsers;
