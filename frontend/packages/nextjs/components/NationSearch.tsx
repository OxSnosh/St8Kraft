'use client';

import { useLazyQuery } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import {client } from '../lib/apolloClient';
// import { SEARCH_NATIONS } from '../lib/queries';
import debounce from 'lodash.debounce';
import { gql } from '@apollo/client';

const SEARCH_NATIONS = gql`
  query SearchNations($search: String) {
    nations(
      first: 10
      where: { name_contains: $search }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      name
      nationId
      ruler
      owner
    }
  }
`;

interface NationSearchProps {
  onSelect?: (nation: { id: string; name: string; nationId: string; ruler: string; owner: string }) => void;
}

export function NationSearch({ onSelect }: NationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchNations, { data }] = useLazyQuery<{ nations: { id: string; name: string; nationId: string; ruler: string; owner: string }[] }>(SEARCH_NATIONS);

  const handleSearch = debounce((value) => {
    searchNations({ variables: { search: value.toLowerCase() } });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search for a nation..."
        className="w-full border px-4 py-2 rounded-md"
        value={searchTerm}
        onChange={handleChange}
      />
      {(data?.nations ?? []).length > 0 && (
        <ul className="absolute z-50 bg-white border w-full mt-1 rounded shadow">
          {(data?.nations ?? []).map((nation: { id: string; name: string; nationId: string; ruler: string; owner: string }) => (
            <li
              key={nation.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(nation.name);
                onSelect?.(nation);
              }}
            >
              {nation.name} ({nation.ruler})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}