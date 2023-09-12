import React from 'react';
import styled from 'styled-components';
import { Button, Grid, TextField } from '@material-ui/core';
import { Edit as EditIcon, Add as AddIcon } from '@material-ui/icons';
import type { ClimbingRoute } from './types';
import { emptyRoute } from './utils/emptyRoute';

const Line = styled.div<{ isSelected: boolean }>`
  ${({ isSelected }) => `background: ${isSelected ? 'gray' : 'transparent'}`}
`;

type Props = {
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  onUpdateExistingRouteClick: (updatedRouteSelectedIndex: number) => void;
};

export const RouteList = ({
  routes,
  routeSelectedIndex,
  setRoutes,
  onUpdateExistingRouteClick,
}: Props) => {
  const onRouteChange = (e, index, updatedField) => {
    const updatedRoute = { ...routes[index], [updatedField]: e.target.value };
    const newRoutes = [
      ...routes.slice(0, index),
      updatedRoute,
      ...routes.slice(index + 1),
    ];
    setRoutes(newRoutes);
  };

  const onNewRouteCreate = () => {
    setRoutes([...routes, emptyRoute]);
  };

  return (
    <div>
      {routes.map(({ name, difficulty, path }, index) => (
        <Line isSelected={routeSelectedIndex === index}>
          <Grid container spacing={2}>
            <Grid item>{index}</Grid>
            <Grid item xs={6}>
              <TextField
                label="Route name"
                value={name}
                placeholder="No name"
                onChange={(e) => onRouteChange(e, index, 'name')}
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                label="Difficulty"
                value={difficulty}
                placeholder="6+"
                onChange={(e) => onRouteChange(e, index, 'difficulty')}
              />
            </Grid>
            <Grid item>
              {path.length === 0 && (
                <Button
                  onClick={() => onUpdateExistingRouteClick(index)}
                  color="secondary"
                  variant="text"
                  size="small"
                  startIcon={<EditIcon />}
                >
                  Draw to schema
                </Button>
              )}
            </Grid>
          </Grid>
        </Line>
      ))}
      <Button
        onClick={onNewRouteCreate}
        color="secondary"
        variant="text"
        size="small"
        startIcon={<AddIcon />}
      >
        Add new route
      </Button>
    </div>
  );
};
