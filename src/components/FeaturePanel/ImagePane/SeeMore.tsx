import { ImageType } from '../../../services/images/getImageDefs';
import { BgImg } from './Image';

type SeeMoreProps = {
  image: ImageType;
  more: number;
  onClick: () => void;
};

export const SeeMoreButton: React.FC<SeeMoreProps> = ({
  image,
  more,
  onClick,
}) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      border: 'none',
      padding: 0,
      background: 'transparent',
      cursor: 'pointer',
    }}
  >
    <BgImg url={image.imageUrl} />
    <span
      style={{
        position: 'relative',
        zIndex: 2,
        color: '#000',
        fontSize: '1rem',
        backgroundColor: 'rgba(212, 212, 216, 0.5)',
        padding: '0.125rem 0.25rem',
        borderRadius: '0.125rem',
      }}
    >
      See {more} More
    </span>
  </button>
);
