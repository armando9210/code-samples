import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';
import lunr from 'lunr';
import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDebounce } from '../../util';

/**
 * [Lunr Documentation](https://lunrjs.com/docs/lunr.Builder.html#field)
 *
 * Type definition for a field used by Lunr.
 *
 */
export interface SearchField<T> {
  /**
   * Name of the field to index in all documents.
   */
  fieldName: string;
  /**
   * Optional attributes associated with this field.
   */
  attributes?: {
    boost?: number,
    /**
     * [Lunr Documentation](https://lunrjs.com/docs/global.html#fieldExtractor)
     *
     * A function that is used to extract a field from a document.
     *
     * Lunr expects a field to be at the top level of a document,
     * if however the field is deeply nested within a document an
     * extractor function can be used to extract the right field
     * for indexing.
     * @param {any} doc
     */
    extractor?: (doc: T) => string | object | object[]
  };
}

type OnResultType<T> = (data: T[], matchData: lunr.Index.Result[], cleared: boolean) => void | React.Dispatch<React.SetStateAction<T[]>>;

export type SearchFields<T> = Array<SearchField<T> | string>;

export interface SearchBarComponent {
  clear: () => void;
}

interface SearchBarProps<T> extends InputProps {
  data: Array<T>;
  /**
   * If the user input should auto submit instead of clicking the search button
   */
  autoSubmit?: boolean;
  // Field reference for result identification
  reference: string;
  /**
   * Fields to use
   */
  fields: SearchFields<T>;

  /**
   * Callback for results.
   *
   * First argument is the result dataset, second argument is an array of the matchData lunr provides for each
   * record within the result dataset.
   */
  onResult: OnResultType<T>;
  elementRef?: Ref<SearchBarComponent>;
}

/**
 * Given a user-entered query, build a lunr query that helps results
 * be better ranked.
 *
 * There are these common scenarios:
 * - User entered a single term, expecting an exact match, i.e.: 1-1001 (This being an ID)
 * - User entered a partial term, expecting to find results that match, i.e.: foo (should match foo, foobar, foo-baz, etc)
 * - User entered a list of terms, separated by a space, expecting an OR lookup
 *    - i.e.: foo bar, matching foo-bar foobar bar-baz bar-foo, etc...
 *
 *  Sample query: title:foo bar baz ->
 *    - Available fields:
 *      - title, name, description
 *    - Output query:
 *      - title: foo
 *      - \*bar\*
 *      -
 *
 * @param userQuery {string} - Original user-entered query
 * @param query - Lunr Query object
 */
function queryBuilder(userQuery: string, query: lunr.Query) {
  lunr.tokenizer(userQuery).forEach(token => {
    // Add an exact match that is boosted
    query.term(token, {
      presence: lunr.Query.presence.OPTIONAL,
      fields: query.allFields,
      boost: 10,
    });

    // Add a wildcard match
    query.term(token, {
      // eslint-disable-next-line no-bitwise
      wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
      presence: lunr.Query.presence.OPTIONAL,
      fields: query.allFields,
    });
  });
}

/**
 * Transforms an Array of objects into a map based on an specific key.
 *
 * i.e.:
 *
 * [{key: 1}, {key: 2}. {key: 3}] => {1: {key: 1}, 2:{key: 2}, 3:{key: 3}}
 *
 * @param data
 * @param key
 */
const mapData = (data: Array<any>, key: string) => data.reduce((p, c): { [key: string]: any } => {
  // eslint-disable-next-line no-param-reassign
  p[c[key]] = c;
  return p;
}, {});

function SearchBar<T>(
  {
    data,
    autoSubmit,
    reference,
    fields,
    onResult,
    disabled,
    elementRef,
    placeholder,
    ...inputProps
  }: SearchBarProps<T>,
) {
  const idx = useRef<lunr.Index | undefined>(undefined);
  const [searchDisabled, setSearchDisabled] = useState<boolean>(true);
  const mappedData = useRef<{ [key: string]: T }>({});
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 500);

  // TODO: move mapData/index build to a worker?
  const init = useCallback(() => {
    // Won't enable the searchbar
    if (!data || data.length === 0 || disabled) {
      return;
    }

    setSearchDisabled(true);

    idx.current = lunr(function builder() {
      /* eslint-disable react/no-this-in-sfc */
      this.pipeline.remove(lunr.stemmer);
      this.pipeline.remove(lunr.stopWordFilter);
      this.ref(reference);
      this.metadataWhitelist = ['position'];

      fields.forEach(f => {
        if (typeof f === 'object') this.field(f.fieldName, f.attributes as object);
        else this.field(f);
      });

      data.forEach(d => this.add(d as unknown as object));
      /* eslint-enable react/no-this-in-sfc */
    });

    mappedData.current = mapData(data, reference);
    setSearchDisabled(false);
  }, [data, fields, reference, setSearchDisabled, disabled]);

  // Whenever the original datasource changes, emit it as a plain result.
  useEffect(() => {
    const result = data || [];
    onResult([...result], [], true);
  }, [data, onResult]);

  useEffect(init, [init]);

  const onSearchResult = useCallback((result: lunr.Index.Result[]) => {
    const filteredData: T[] = result.map(r => mappedData.current[r.ref]);
    onResult(filteredData, result, false);
  }, [onResult, mappedData]);

  const executeQuery = useCallback((q: string) => {
    if (!q || q === '') {
      const result = data || [];
      onResult([...result], [], true);
      return;
    }

    if (!idx.current) {
      return;
    }

    // Process query and only yield those who scored greater than 1
    const res = idx.current?.query((lunrQuery: any) => {
      queryBuilder(q, lunrQuery);
    });
    onSearchResult(res);
  }, [data, onSearchResult, idx, onResult]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  useImperativeHandle(elementRef, () => ({
    clear: clearSearch,
  }), [clearSearch]);

  useEffect(() => executeQuery(debouncedQuery), [debouncedQuery, executeQuery]);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      allowClear
      {...inputProps}
      disabled={searchDisabled || disabled}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

SearchBar.defaultProps = {
  autoSubmit: true,
  elementRef: undefined,
};

export default SearchBar;
