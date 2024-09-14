import styled from '@emotion/styled';

export const HEIGHT = 238;

export const ImageSkeleton = styled.div`
  width: 100%;
  height: ${HEIGHT}px;
  margin: 0 auto;
  animation: skeleton-loading 1s linear infinite alternate;

  @keyframes skeleton-loading {
    0% {
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'hsl(0,0%,40%)' : 'hsl(0, 0%, 95%)'};
    }
    100% {
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'hsl(0, 0%,32%)' : 'hsl(0, 0%, 87%)'};
    }
  }
`;

export const isElementVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
