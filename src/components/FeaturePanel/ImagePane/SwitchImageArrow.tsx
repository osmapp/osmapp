import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

const bounce = keyframes`
  0%, 100% {
    transform: translateX(15%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

const BouncingWrapper = styled.div`
  display: inline-block; /* Ensures it only wraps the size of the child */
  animation: ${bounce} 1s infinite;
`;

const FloatingButton = styled.button<{ position: 'right' | 'left' }>`
  width: 2rem;
  height: 2rem;
  position: absolute;
  background-color: rgba(212, 212, 216, 0.5);
  border-radius: 100vmax;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;

  ${({ position }) =>
    position === 'right' ? 'right: 0.5rem;' : 'left: 0.5rem;'}
`;

type ArrowProps = {
  position: 'left' | 'right';
  rightBouncing: boolean;
  onClick: () => void;
};

const ArrowButton: React.FC<ArrowProps> = ({
  position,
  rightBouncing,
  onClick,
}) => {
  const arrow = position === 'left' ? <ArrowLeft /> : <ArrowRight />;

  return (
    <FloatingButton position={position} onClick={onClick}>
      {rightBouncing && position === 'right' ? (
        <BouncingWrapper>{arrow}</BouncingWrapper>
      ) : (
        arrow
      )}
    </FloatingButton>
  );
};

type SwitchImageArrowsProps = {
  onLeft?: () => void;
  onRight?: () => void;
  onClick?: (pos: 'left' | 'right') => void;

  rightBouncing: boolean;
  showLeft?: boolean;
  showRight?: boolean;
};

export const SwitchImageArrows: React.FC<SwitchImageArrowsProps> = ({
  onLeft,
  onRight,
  onClick,
  rightBouncing,
  showLeft = true,
  showRight = true,
}) => (
  <>
    {showLeft && (
      <ArrowButton
        rightBouncing={false}
        position="left"
        onClick={() => {
          if (onLeft) onLeft();
          if (onClick) onClick('left');
        }}
      />
    )}
    {showRight && (
      <ArrowButton
        rightBouncing={rightBouncing}
        position="right"
        onClick={() => {
          if (onRight) onRight();
          if (onClick) onClick('right');
        }}
      />
    )}
  </>
);
