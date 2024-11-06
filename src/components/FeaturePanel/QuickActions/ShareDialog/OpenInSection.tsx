import { List, ListItem } from '@mui/material';
import { useGetItems } from './useGetItems';
import OpenInNew from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';
import { t } from '../../../../services/intl';

const StyledMenuItem = styled(ListItem)`
  svg {
    font-size: 12px;
    color: #bbb;
    margin: -7px 0 0 5px;
  }

  &:focus {
    text-decoration: none;
    svg {
      outline: 0;
    }
  }

  img {
    max-width: 35px;
    max-height: 35px;
  }

  color: inherit;

  display: flex;
  gap: 0.5rem;
` as any;

type LinkItemProps = {
  href: string;
  label: string;
  image?: string;
};

const LinkItem = ({ href, label, image }: LinkItemProps) => (
  <StyledMenuItem component="a" href={href} target="_blank">
    {image && <img src={image} alt={`Logo of ${label}`} />}
    {label}
    <OpenInNew />
  </StyledMenuItem>
);

export const OpenInSection = () => {
  const { items } = useGetItems();

  return (
    <section>
      <h3>{t('sharedialog.openin')}</h3>
      <List>
        {items.map(({ label, href, image }) => (
          <LinkItem key={label} href={href} label={label} image={image} />
        ))}
      </List>
    </section>
  );
};
