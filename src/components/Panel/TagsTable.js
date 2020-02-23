// @flow

import * as React from 'react';
import styled from 'styled-components';
import truncate from 'lodash/truncate';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { useToggleState } from '../helpers';
import { getUrlForTag } from './helpers';

const Table = styled.table`
  margin-top: 1em;
  font-size: 1rem;

  th {
    width: 140px;
    max-width: 140px;
    overflow: auto;
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
  }

  td {
    overflow: auto;
    max-width: 195px;
  }

  th,
  td {
    padding: 0.1em;
  }

  table {
    padding-left: 1em;
    padding-bottom: 1em;
  }
`;

const isAddr = k => k.match(/^addr:|uir_adr|:addr/);
const isName = k => k.match(/^([a-z]+_)?name(:|$)/);
const isBuilding = k => k.match(/building|roof|^min_level|^max_level|height$/);
const isNetwork = k => k.match(/network/);

const StyledToggleButton = styled(IconButton)`
  margin: -15px -15px -15px 0 !important;
`;
const ToggleButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && <ExpandMoreIcon fontSize="small" />}
    {isShown && <ExpandLessIcon fontSize="small" />}
  </StyledToggleButton>
);

const TagsGroup = ({ tags, label, value, hideArrow }) => {
  const [isShown, toggle] = useToggleState(false);

  if (!tags.length) {
    return null;
  }

  return (
    <>
      <tr>
        <th>{label}</th>
        <td>
          {value || Object.values(tags)[0]}
          {!hideArrow && <ToggleButton onClick={toggle} isShown={isShown} />}
        </td>
      </tr>
      {isShown && (
        <tr>
          <td colSpan="2">
            <table>
              <tbody>
                {tags.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

const buildAddress = tagsArr => {
  const tags = tagsArr.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  const {
    'addr:street': str,
    'addr:housenumber': num,
    'addr:city': city,
  } = tags;

  return `${str} ${num || ''}${city ? `, ${city}` : ''}`;
};

const renderValue = (k, v) => {
  const url = getUrlForTag(k, v);
  return url ? <a href={url}>{v.replace(/^https?:\/\//, '')}</a> : v;
};

const TagsTable = ({ tags }) => {
  const tagsArr = Object.entries(tags);
  const addrTags = tagsArr.filter(([k]) => isAddr(k));
  const nameTags = tagsArr.filter(([k]) => isName(k));
  const buildingTags = tagsArr.filter(([k]) => isBuilding(k));
  const networkTags = tagsArr.filter(([k]) => isNetwork(k));
  const restTags = tagsArr.filter(
    ([k]) => !isName(k) && !isAddr(k) && !isBuilding(k) && !isNetwork(k),
  );

  return (
    <Table>
      <tbody>
        <TagsGroup
          tags={nameTags}
          label="name"
          value={truncate(tags.name, { length: 25 })}
          hideArrow={nameTags.length === 1}
        />
        <TagsGroup
          tags={addrTags}
          label="addr:*"
          value={buildAddress(addrTags)}
        />
        {restTags.map(([k, v]) => (
          <tr key={k}>
            <th>{k}</th>
            <td>{renderValue(k, v)}</td>
          </tr>
        ))}
        <TagsGroup
          tags={buildingTags}
          label="building:*"
          value={tags.building}
        />
        <TagsGroup tags={networkTags} label="network:*" value={tags.network} />
      </tbody>
    </Table>
  );
};

export default TagsTable;
