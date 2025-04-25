'use client';

import { gql, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import debounce from 'lodash.debounce';

const SEARCH_NATIONS = gql`
  query SearchNations($where: Nation_filter) {
    nations(
      first: 10
      where: $where
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

const FILTER_OPTIONS = [
  { label: 'Nation Name', value: 'name' },
  { label: 'Ruler Name', value: 'ruler' },
  { label: 'Nation ID', value: 'nationId' },
];

export function NationSearchBar() {
  const [filterBy, setFilterBy] = useState<'name' | 'ruler' | 'nationId'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const [searchNations, { data, loading }] = useLazyQuery(SEARCH_NATIONS);

  const handleSearch = debounce((value: string) => {
    if (!value.trim()) return;

    let whereClause;
    if (filterBy === 'nationId') {
      whereClause = { nationId: value }; // exact match
    } else {
      whereClause = { [`${filterBy}_contains_nocase`]: value }; // partial match
    }

    searchNations({ variables: { where: whereClause } });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSelect = (nation: {
    id: string;
    name: string;
    nationId: string;
    ruler: string;
    owner: string;
  }) => {
    localStorage.setItem('selectedMenuItem', `Nation ${nation.nationId}`);
    router.push(`/nations?id=${nation.nationId}`);
  };

  return (
    <div className="relative w-full max-w-md space-y-2">
      <div className="flex gap-2">
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as 'name' | 'ruler' | 'nationId')}
          className="select select-bordered dark:bg-gray-800 dark:text-white"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterBy}...`}
          className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute z-50 bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-600 w-full mt-1 rounded shadow px-4 py-2">
          Loading...
        </div>
      )}

      {/* Results */}
      {(data?.nations ?? []).length > 0 && (
        <ul className="absolute z-50 bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-600 w-full mt-1 rounded shadow">
          {(data.nations as {
            id: string;
            name: string;
            nationId: string;
            ruler: string;
            owner: string;
          }[]).map((nation) => (
            <li
              key={nation.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(nation)}
            >
              Nation: {nation.name} | Ruler: {nation.ruler} | ID: {nation.nationId}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {searchTerm && !(data?.nations.length) && !loading && (
        <div className="absolute z-50 bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-600 w-full mt-1 rounded shadow px-4 py-2">
          No results found
        </div>
      )}
    </div>
  );
}
