import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ButtonGroup,
} from '@mui/material';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PointType } from '../types';
import UndoIcon from '@mui/icons-material/Undo';

const Container = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 4px;
  left: 0;
  right: 0px;
  overflow: auto;
  width: 100%;
  padding: 0 12px 8px 12px;
  text-align: right;
  pointer-events: none;
`;

export const RouteFloatingMenu = () => {
  const [isDeletePointDialogVisible, setIsDeletePointDialogVisible] =
    useState(false);
  const [showRouteMarksMenu, setShowRouteMarksMenu] = useState(false);
  const {
    getMachine,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    getCurrentPath,
    setRouteIndexHovered,
    isEditMode,
  } = useClimbingContext();
  const path = getCurrentPath();
  const machine = getMachine();

  const isExtendVisible =
    (machine.currentStateName === 'pointMenu' &&
      routes[routeSelectedIndex] &&
      pointSelectedIndex === getCurrentPath().length - 1) ||
    machine.currentStateName === 'editRoute';

  const areCragPointsVisible = isEditMode;
  const isDoneVisible = machine.currentStateName === 'extendRoute';
  const isUndoVisible =
    machine.currentStateName === 'extendRoute' && path.length !== 0;

  const onFinishClimbingRouteClick = useCallback(() => {
    machine.execute('finishRoute');
  }, [machine]);
  const onContinueClimbingRouteClick = useCallback(() => {
    machine.execute('extendRoute');
  }, [machine]);

  const onMockPointsClick = useCallback(() => {
    machine.execute('mockPoints');
  }, [machine]);

  const onMockPointsFinish = () => {
    machine.execute('editRoute');
  };

  const onDeletePoint = () => {
    machine.execute('deletePoint');
    setIsDeletePointDialogVisible(false);
  };

  const toggleDeletePointDialog = () => {
    setIsDeletePointDialogVisible(!isDeletePointDialogVisible);
  };

  const onPointTypeChange = useCallback(
    (type: PointType) => {
      machine.execute('changePointType', { type });

      setShowRouteMarksMenu(false);
    },
    [machine],
  );

  const onMouseEnter = () => {
    setRouteIndexHovered(routeSelectedIndex);
  };

  const onMouseLeave = () => {
    setRouteIndexHovered(null);
  };
  const handleUndo = useCallback(
    (e) => {
      machine.execute('undoPoint');
      e.preventDefault();
    },
    [machine],
  );

  React.useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'b') {
        onPointTypeChange('bolt');
      }
      if (e.key === 'a') {
        onPointTypeChange('anchor');
      }
      if (e.key === 's') {
        onPointTypeChange('sling');
      }
      if (e.key === 'p') {
        onPointTypeChange('piton');
      }
      if (e.key === 'u') {
        onPointTypeChange('unfinished');
      }
      if (e.key === 'n') {
        onPointTypeChange(null);
      }
      if (e.key === 'e') {
        onContinueClimbingRouteClick();
      }
      if (e.key === 'm') {
        onMockPointsClick();
      }
      if (isUndoVisible && e.key === 'z' && e.metaKey) {
        handleUndo(e);
      }
      if (isDoneVisible && (e.key === 'Enter' || e.key === 'Escape')) {
        onFinishClimbingRouteClick();
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [
    handleUndo,
    isDoneVisible,
    isUndoVisible,
    onContinueClimbingRouteClick,
    onFinishClimbingRouteClick,
    onMockPointsClick,
    onPointTypeChange,
  ]);

  return (
    <>
      <Dialog
        open={isDeletePointDialogVisible}
        onClose={toggleDeletePointDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete point?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this point?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeletePointDialog} autoFocus>
            Cancel
          </Button>
          <Button onClick={onDeletePoint} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Container>
        <ButtonGroup
          variant="contained"
          size="small"
          color="primary"
          sx={{ pointerEvents: 'all', gap: 0.5 }}
        >
          {showRouteMarksMenu ? (
            <>
              <Button
                onClick={() => {
                  setShowRouteMarksMenu(false);
                }}
                startIcon={<ArrowBackIcon />}
                sx={{
                  '> *': {
                    margin: 0,
                  },
                }}
              />
              <Button
                onClick={() => {
                  onPointTypeChange('bolt');
                }}
              >
                Bolt
              </Button>
              <Button
                onClick={() => {
                  onPointTypeChange('anchor');
                }}
              >
                Anchor
              </Button>
              <Button
                onClick={() => {
                  onPointTypeChange('sling');
                }}
              >
                Sling
              </Button>
              <Button
                onClick={() => {
                  onPointTypeChange('piton');
                }}
              >
                Piton
              </Button>
              <Button
                onClick={() => {
                  onPointTypeChange('unfinished');
                }}
              >
                Unfinished
              </Button>
              <Button
                onClick={() => {
                  onPointTypeChange(null);
                }}
              >
                None
              </Button>
            </>
          ) : (
            <>
              {isExtendVisible && (
                <Button
                  onClick={onContinueClimbingRouteClick}
                  startIcon={<AddLocationIcon />}
                >
                  Extend
                </Button>
              )}
              {areCragPointsVisible &&
                (machine.currentStateName === 'mockPoints' ? (
                  <Button onClick={onMockPointsFinish}>
                    Finish mock points
                  </Button>
                ) : (
                  <Button onClick={onMockPointsClick}>Mock points</Button>
                ))}
              {machine.currentStateName === 'pointMenu' && (
                <Button
                  onClick={() => {
                    setShowRouteMarksMenu(true);
                  }}
                >
                  Type
                </Button>
              )}
              {isUndoVisible && (
                <Button
                  onClick={handleUndo}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  startIcon={<UndoIcon fontSize="small" />}
                >
                  Undo
                </Button>
              )}
              {machine.currentStateName === 'pointMenu' && (
                <Button
                  onClick={toggleDeletePointDialog}
                  startIcon={<DeleteIcon />}
                  sx={{
                    '> *': {
                      margin: 0,
                    },
                  }}
                />
              )}

              {isDoneVisible && (
                <Button
                  onClick={onFinishClimbingRouteClick}
                  startIcon={<CheckIcon />}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  Done
                </Button>
              )}
            </>
          )}
        </ButtonGroup>
      </Container>
    </>
  );
};
