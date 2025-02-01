import React from 'react';

type TextMarkerProps = {
  width?: number;
  height?: number;
  text: string;
  hasShadow?: boolean;
  hasPin?: boolean;
};

export const TextMarker = ({
  width,
  height,
  text,
  hasShadow = false,
  hasPin = true,
}: TextMarkerProps) => (
  <svg display="block" height={height} width={width} viewBox="0 0 27 41">
    <g fillRule="nonzero">
      {hasShadow && (
        <g transform="translate(3.0, 29.0)" fill="#000000">
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="10.5"
            ry="5.25002273"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="10.5"
            ry="5.25002273"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="9.5"
            ry="4.77275007"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="8.5"
            ry="4.29549936"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="7.5"
            ry="3.81822308"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="6.5"
            ry="3.34094679"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="5.5"
            ry="2.86367051"
          ></ellipse>
          <ellipse
            opacity="0.04"
            cx="10.5"
            cy="5.80029008"
            rx="4.5"
            ry="2.38636864"
          ></ellipse>
        </g>
      )}
      {hasPin ? (
        <>
          <path
            fill="#239b56"
            d="M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"
          ></path>
          <g opacity="0.25" fill="#000000">
            <path d="M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"></path>
          </g>
        </>
      ) : (
        <circle cx="13.5" cy="13.5" r="13.5" fill="#239b56"></circle>
      )}

      <g transform="translate(8.0, 8.0)">
        <text
          x="0"
          y="11"
          fontSize={16}
          fontWeight={900}
          fill="white"
          fontFamily="Roboto"
        >
          {text}
        </text>
      </g>
    </g>
  </svg>
);

const ASCII_NUMBER_A = 65;
const ALPHABET_LETTERS_COUNT = 41;

type AlphabeticalMarkerProps = {
  index: number;
  hasShadow?: boolean;
  width?: number;
  height?: number;
  hasPin?: boolean;
};

export const AlphabeticalMarker = ({
  index,
  hasShadow,
  width,
  height,
  hasPin = true,
}: AlphabeticalMarkerProps) => (
  <TextMarker
    text={
      index < ALPHABET_LETTERS_COUNT
        ? String.fromCharCode(index + ASCII_NUMBER_A)
        : ''
    }
    hasShadow={hasShadow}
    width={width}
    height={height}
    hasPin={hasPin}
  />
);
