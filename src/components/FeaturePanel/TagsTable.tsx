import React from 'react';
import styled from 'styled-components';
import truncate from 'lodash/truncate';

import { useToggleState } from '../helpers';
import { getUrlForTag, ToggleButton } from './helpers';
import { EditIconButton } from './EditIconButton';

const Wrapper = styled.div`
  position: relative;
`;

const Table = styled.table`
  font-size: 1rem;
  width: 100%;

  th,
  td {
    padding: 0.1em;
    overflow: hidden;

    &:hover .show-on-hover {
      display: block !important;
    }
  }

  th {
    width: 140px;
    max-width: 140px;
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
    padding-left: 0;
  }

  table {
    padding-left: 1em;
    padding-bottom: 1em;
  }
`;

const renderValue = (k, v) => {
  const url = getUrlForTag(k, v);
  return url ? <a href={url}>{v.replace(/^https?:\/\//, '')}</a> : v;
};

const isAddr = (k) => k.match(/^addr:|uir_adr|:addr/);
const isName = (k) => k.match(/^([a-z]+_)?name(:|$)/);
const isBuilding = (k) =>
  k.match(/building|roof|^min_level|^max_level|height$/);
const isNetwork = (k) => k.match(/network/);
const isBrand = (k) => k.match(/^brand/);
const isPayment = (k) => k.match(/^payment/);

const TagsGroup = ({ tags, label, value, hideArrow = false, onEdit }) => {
  const [isShown, toggle] = useToggleState(false);

  if (!tags.length) {
    return null;
  }

  return (
    <>
      <tr>
        <th>{label}</th>
        <td>
          <EditIconButton onClick={() => onEdit(tags[0][0])} />

          {value || tags[0]?.join(' = ')}
          {!hideArrow && <ToggleButton onClick={toggle} isShown={isShown} />}
        </td>
      </tr>
      {isShown && (
        <tr>
          <td colSpan={2}>
            <table>
              <tbody>
                {tags.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{renderValue(k, v)}</td>
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

const join = (a, sep, b) => `${a || ''}${a && b ? sep : ''}${b || ''}`;

const buildAddress = (tagsArr) => {
  const {
    'addr:street': street,
    'addr:housenumber': num,
    'addr:city': city,
  } = Object.fromEntries(tagsArr);

  return join(join(street, ' ', num), ', ', city);
};

const TagsTable = ({ tags, except, onEdit }) => {
  const tagsEntries = Object.entries(tags).filter(([k]) => !except.includes(k));

  const addr = tagsEntries.filter(([k]) => isAddr(k));
  const name = tagsEntries.filter(([k]) => isName(k));
  const building = tagsEntries.filter(([k]) => isBuilding(k));
  const network = tagsEntries.filter(([k]) => isNetwork(k));
  const brand = tagsEntries.filter(([k]) => isBrand(k));
  const payment = tagsEntries.filter(([k]) => isPayment(k));
  const rest = tagsEntries.filter(
    ([k]) =>
      !isName(k) &&
      !isAddr(k) &&
      !isBuilding(k) &&
      !isNetwork(k) &&
      !isPayment(k) &&
      !isBrand(k),
  );

  return (
    <Wrapper>
      <Table>
        <tbody>
          <TagsGroup
            tags={name}
            label="name:*"
            value={tags.short_name || truncate(tags.name, { length: 25 })}
            hideArrow={name.length === 1}
            onEdit={onEdit}
          />
          <TagsGroup
            tags={addr}
            label="addr:*"
            value={buildAddress(addr)}
            onEdit={onEdit}
          />
          {rest.map(([k, v]) => (
            <tr key={k}>
              <th>{k}</th>
              <td>
                <EditIconButton onClick={() => onEdit(k)} />
                {renderValue(k, v)}
              </td>
            </tr>
          ))}
          <TagsGroup
            tags={brand}
            label="brand:*"
            value={tags.brand}
            onEdit={onEdit}
          />
          <TagsGroup
            tags={building}
            label="building:*"
            value={tags.building}
            onEdit={onEdit}
          />
          <TagsGroup
            tags={network}
            label="network:*"
            value={tags.network}
            onEdit={onEdit}
          />
          <TagsGroup
            tags={payment}
            label="payment:*"
            value={tags.payment}
            onEdit={onEdit}
          />
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default TagsTable;
