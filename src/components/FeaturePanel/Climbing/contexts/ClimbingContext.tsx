import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  ClimbingRoute,
  PathPoint,
  PathPoints,
  Position,
  PositionPx,
  Size,
  ZoomState,
} from '../types';
import { updateElementOnIndex } from '../utils/array';
import { findCloserPointFactory } from '../utils/findCloserPoint';
import {
  ActionWithCallback,
  State,
  StateAction,
  useGetMachineFactory,
} from '../utils/useGetMachineFactory';
import { positionUtilsFactory } from '../utils/positionUtilsFactory';
import { Feature } from '../../../../services/types';
import { osmToClimbingRoutes } from './osmToClimbingRoutes';
import { publishDbgObject } from '../../../../utils';
import { getContainedSizeImage } from '../utils/image';

type LoadedPhotos = Record<string, Record<number, boolean>>;
type ImageSize = {
  width: number;
  height: number;
};
type PhotoInfo =
  | null
  | 'hasPathOnThisPhoto'
  | 'isOnThisPhoto'
  | 'hasPathInDifferentPhoto'
  | 'isOnDifferentPhoto';

type ClimbingContextType = {
  editorPosition: PositionPx;
  imageSize: ImageSize;
  imageContainerSize: ImageSize;
  isPointMoving: boolean;
  isPanningDisabled: boolean;
  setIsPanningDisabled: (isPanningDisabled: boolean) => void;
  isRouteSelected: (routeNumber: number) => boolean;
  isOtherRouteSelected: (routeNumber: number) => boolean;
  isRouteHovered: (routeNumber: number) => boolean;
  isPointSelected: (pointNumber: number) => boolean;
  pointSelectedIndex: number;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  isPointClicked: boolean;
  setIsPointClicked: (isPointClicked: boolean) => void;
  setEditorPosition: (position: PositionPx) => void;
  setImageSize: (ImageSize) => void;
  setImageContainerSize: (ImageSize) => void;
  photoPaths: Array<string>;
  setPhotoPaths: (path: Array<string>) => void;
  photoPath: string;
  setPhotoPath: (path: string) => void;
  setIsPointMoving: (isPointMoving: boolean) => void;
  setPointSelectedIndex: (pointSelectedIndex: number) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
  updateRouteOnIndex: (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => void;
  updatePathOnRouteIndex: (
    routeIndex: number,
    callback?: (path: PathPoints) => PathPoints,
  ) => void;
  getPixelPosition: (position: Position) => PositionPx;
  getPathForRoute: (route: ClimbingRoute) => PathPoints;
  getCurrentPath: () => PathPoints;
  getPercentagePosition: (position: PositionPx) => Position;
  addZoom: (position: PositionPx) => PositionPx;
  getMachine: () => {
    currentState: Partial<Record<StateAction, ActionWithCallback>>;
    currentStateName: State;
    execute: (desiredAction: StateAction, props?: unknown) => void;
  };
  scrollOffset: PositionPx;
  setScrollOffset: (scrollOffset: PositionPx) => void;
  findCloserPoint: (position: Position) => PathPoint | null;
  photoZoom: ZoomState;
  setPhotoZoom: (photoZoom: ZoomState) => void;
  areRoutesLoading: boolean;
  setAreRoutesLoading: (areRoutesLoading: boolean) => void;
  mousePosition: PositionPx;
  setMousePosition: (mousePosition: PositionPx | null) => void;
  pointElement: null | HTMLElement;
  setPointElement: (pointElement: null | HTMLElement) => void;
  moveRoute: (from: number, to: number) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean | ((old: boolean) => boolean)) => void;
  viewportSize: Size;
  setViewportSize: (size: Size) => void;
  routeIndexHovered: number;
  setRouteIndexHovered: (routeIndexHovered: number) => void;
  routeIndexExpanded: number | null;
  setRouteIndexExpanded: (routeIndexHovered: number | null) => void;
  loadedPhotos: LoadedPhotos;
  setLoadedPhotos: (loadedPhotos: LoadedPhotos) => void;
  loadPhotoRelatedData: () => void;
  filterDifficulty: Array<string>;
  setFilterDifficulty: (filterDifficulty: Array<string>) => void;
  photoRef: React.MutableRefObject<any>;
  svgRef: React.MutableRefObject<any>;
  getAllRoutesPhotos: (cragPhotos: Array<string>) => void;
  showDebugMenu: boolean;
  setShowDebugMenu: (showDebugMenu: boolean) => void;
  arePointerEventsDisabled: boolean; // @TODO do we need it?
  setArePointerEventsDisabled: (arePointerEventsDisabled: boolean) => void;
  preparePhotos: (cragPhotos: Array<string>) => void;
  routeListTopOffsets: Array<number>;
  setRouteListTopOffset: (
    routeIndex: number,
    routeListTopOffset: number,
  ) => void;
  mockedPoints: PathPoints;
  setMockedPoints: (mockedPoints: PathPoints) => void;
};

// @TODO generate?
export const ClimbingContext = createContext<ClimbingContextType | null>(null);

type Props = {
  children: ReactNode;
  feature: Feature;
};

export const initialPhotoZoom = {
  scale: 1,
  positionX: 0,
  positionY: 0,
};

export const ClimbingContextProvider = ({ children, feature }: Props) => {
  const initialRoutes = osmToClimbingRoutes(feature);
  publishDbgObject('climbingRoutes', initialRoutes);
  const photoRef = useRef(null);
  const svgRef = useRef(null);
  const [photoPaths, setPhotoPaths] = useState<Array<string>>(null);
  const [photoPath, setPhotoPath] = useState<string>(null); // photo, should be null
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageContainerSize, setImageContainerSize] = useState({
    width: 0,
    height: 0,
  });
  const [loadedPhotos, setLoadedPhotos] = useState<LoadedPhotos>({});
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>(initialRoutes);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [isPanningDisabled, setIsPanningDisabled] = useState<boolean>(false);
  const [isPointClicked, setIsPointClicked] = useState<boolean>(false);
  const [areRoutesLoading, setAreRoutesLoading] = useState<boolean>(true);
  const [arePointerEventsDisabled, setArePointerEventsDisabled] =
    useState<boolean>(false);
  const [routeIndexHovered, setRouteIndexHovered] = useState<number>(null);
  const [mousePosition, setMousePosition] = useState<PositionPx | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<Array<string>>([]);
  const [routeIndexExpanded, setRouteIndexExpanded] = useState<number>(null);
  const [mockedPoints, setMockedPoints] = useState<PathPoints>([]);
  const [editorPosition, setEditorPosition] = useState<PositionPx>({
    x: 0,
    y: 0,
    units: 'px',
  });
  const [photoZoom, setPhotoZoom] = useState<ZoomState>(initialPhotoZoom);
  const [viewportSize, setViewportSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [scrollOffset, setScrollOffset] = useState<PositionPx>({
    x: 0,
    y: 0,
    units: 'px',
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);

  const [pointElement, setPointElement] = React.useState<null | HTMLElement>(
    null,
  );
  const [routeListTopOffsets, setRouteListTopOffsets] = React.useState<
    Array<number>
  >([]);

  const setRouteListTopOffset = useCallback((index: number, offset: number) => {
    setRouteListTopOffsets((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions[index] = offset;
      return newPositions;
    });
  }, []);

  const getPathOnIndex = (index: number) =>
    routes[index]?.paths?.[photoPath] || [];

  const getPathForRoute = (route: ClimbingRoute) =>
    route?.paths?.[photoPath] || [];

  const getCurrentPath = () => getPathOnIndex(routeSelectedIndex);

  const updateRouteOnIndex = (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => {
    setRoutes((prevRoutes) => {
      return updateElementOnIndex<ClimbingRoute>(
        prevRoutes,
        routeIndex,
        callback,
      );
    });
  };

  const updatePathOnRouteIndex = (
    routeIndex: number,
    callback?: (route: PathPoints) => PathPoints,
  ) =>
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      paths: {
        ...(route?.paths ?? {}),
        [photoPath]: callback(getPathOnIndex(routeIndex)),
      },
    }));

  const moveRoute = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < routes.length &&
      toIndex < routes.length &&
      fromIndex >= 0 &&
      toIndex >= 0
    ) {
      const itemToMove = routes[fromIndex];
      const newArray = routes.filter((_, index) => index !== fromIndex); // Vytvoří nové pole bez přesunutého prvku
      newArray.splice(toIndex, 0, itemToMove); // Vloží prvek na novou pozici
      setRoutes(newArray);
    }
  };

  const findCloserPoint = findCloserPointFactory({
    routeSelectedIndex,
    routes,
    getPathForRoute,
  });

  const { getPixelPosition, getPercentagePosition, addZoom } =
    positionUtilsFactory({
      editorPosition,
      imageSize,
      photoZoom,
    });

  const getMachine = useGetMachineFactory({
    setRouteSelectedIndex,
    setPointSelectedIndex,
    updatePathOnRouteIndex,
    updateElementOnIndex,
    routeSelectedIndex,
    pointSelectedIndex,
    setRouteIndexHovered,
    setMousePosition,
    setRoutes,
    routes,
    updateRouteOnIndex,
    getPercentagePosition,
    findCloserPoint,
    svgRef,
    photoZoom,
    mockedPoints,
    setMockedPoints,
  });

  const isRouteSelected = (index: number) => routeSelectedIndex === index;
  const isOtherRouteSelected = (index: number) =>
    routeSelectedIndex !== null && isRouteSelected(index) === false;
  const isRouteHovered = (index: number) => routeIndexHovered === index;
  const isPointSelected = (index: number) => pointSelectedIndex === index;

  const getAllRoutesPhotos = (cragPhotos: Array<string>) => {
    const photos = routes.reduce((acc, route) => {
      if (!route.paths) return [];
      const routePhotos = Object.keys(route.paths);
      return [...new Set([...acc, ...cragPhotos, ...routePhotos])];
    }, []);

    setPhotoPaths(photos);
  };

  const preparePhotos = (cragPhotos: Array<string>) => {
    if (photoPaths === null) getAllRoutesPhotos(cragPhotos);
  };

  const loadPhotoRelatedData = () => {
    if (photoRef.current) {
      const [width, height] = getContainedSizeImage(photoRef.current);
      const { left, top } = photoRef.current.getBoundingClientRect();

      setImageContainerSize({
        width: photoRef.current.width,
        height: photoRef.current.height,
      });
      setImageSize({
        width,
        height,
      });
      setEditorPosition({ x: left, y: top, units: 'px' });
      setViewportSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
      });
    }
    setAreRoutesLoading(false);
  };

  const climbingState: ClimbingContextType = {
    editorPosition,
    getPercentagePosition,
    getPixelPosition,
    imageSize,
    isPointClicked,
    isPointMoving,
    isPanningDisabled,
    setIsPanningDisabled,
    isRouteSelected,
    isOtherRouteSelected,
    isRouteHovered,
    isPointSelected,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    setEditorPosition,
    setImageSize,
    setIsPointClicked,
    setIsPointMoving,
    setPointSelectedIndex,
    setRoutes,
    setRouteSelectedIndex,
    updateRouteOnIndex,
    updatePathOnRouteIndex,
    getMachine,
    getPathForRoute,
    getCurrentPath,
    scrollOffset,
    setScrollOffset,
    findCloserPoint,
    mousePosition,
    setMousePosition,
    pointElement,
    setPointElement,
    moveRoute,
    isEditMode,
    setIsEditMode,
    viewportSize,
    setViewportSize,
    routeIndexHovered,
    setRouteIndexHovered,
    photoPath,
    photoPaths,
    setPhotoPaths,
    setPhotoPath,
    routeIndexExpanded,
    setRouteIndexExpanded,
    loadPhotoRelatedData,
    filterDifficulty,
    setFilterDifficulty,
    photoRef, // @TODO rename: technically it's not photoRef but photoContainerRef, because photo is scaled by object-fit: contain
    svgRef,
    areRoutesLoading,
    setAreRoutesLoading,
    photoZoom,
    setPhotoZoom,
    addZoom,
    getAllRoutesPhotos,
    showDebugMenu,
    setShowDebugMenu,
    arePointerEventsDisabled,
    setArePointerEventsDisabled,
    preparePhotos,
    imageContainerSize,
    setImageContainerSize,
    loadedPhotos,
    setLoadedPhotos,
    routeListTopOffsets,
    setRouteListTopOffset,
    mockedPoints,
    setMockedPoints,
  };

  return (
    <ClimbingContext.Provider value={climbingState}>
      {children}
    </ClimbingContext.Provider>
  );
};

export const useClimbingContext = () => {
  const context = useContext(ClimbingContext);
  if (!context) {
    throw new Error(
      'useClimbingContext must be used within a ClimbingProvider',
    );
  }
  return context;
};
