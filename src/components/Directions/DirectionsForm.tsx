import { Option } from '../SearchBox/types';
import { PointsTooFarError, Profile, RoutingResult } from './routing/types';
import { type ShowToast, useSnackbar } from '../utils/SnackbarContext';
import { buildUrl, CloseButton, parseUrlParts } from './helpers';
import Router, { useRouter } from 'next/router';
import {
  destroyRouting,
  getLastMode,
  handleRouting,
} from './routing/handleRouting';
import { getOptionToLonLat } from '../SearchBox/getOptionToLonLat';
import React, { useEffect, useRef, useState } from 'react';
import { StyledPaper } from './Result';
import { Stack } from '@mui/material';
import { ModeToggler } from './ModeToggler';
import { DirectionsAutocomplete } from './DirectionsAutocomplete';
import { t } from '../../services/intl';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { FetchError } from '../../services/helpers';
import * as Sentry from '@sentry/nextjs';
import { getLastFeature } from '../../services/lastFeatureStorage';
import { getCoordsOption } from '../SearchBox/options/coords';
import { getLabel } from '../../helpers/featureLabel';
import { useMapStateContext } from '../utils/MapStateContext';

const getRoutingFailed = (showToast: ShowToast) => {
  return (error: unknown) => {
    if (error instanceof PointsTooFarError) {
      showToast(t('directions.error.too_far'), 'warning');
    } else if (error instanceof FetchError) {
      Sentry.captureException(error);
      showToast(`${t('error')} code ${error.code}`, 'error');
    } else {
      Sentry.captureException(error);
      showToast(`${t('error')} – ${error}`, 'error');
      throw error;
    }
  };
};

const useReactToUrl = (
  setMode: (param: ((current: string) => string) | string) => void,
  setFrom: (value: Option) => void,
  setTo: (value: Option) => void,
  setResult: (result: RoutingResult) => void,
) => {
  const { showToast } = useSnackbar();
  const initialModeWasSet = useRef(false);
  const router = useRouter();
  const urlParts = router.query.all;

  useEffect(() => {
    const [, mode, ...points] = urlParts as [string, Profile, ...string[]];
    const options = parseUrlParts(points);

    if (mode && options.length === 2) {
      setMode(mode);
      setFrom(options[0]);
      setTo(options[1]);
      handleRouting(mode, options.map(getOptionToLonLat))
        .then(setResult)
        .catch(getRoutingFailed(showToast));
    } else {
      if (initialModeWasSet.current === false && getLastMode()) {
        setMode(getLastMode());
        initialModeWasSet.current = true;
      }

      const lastFeature = getLastFeature();
      if (lastFeature) {
        setTo(getCoordsOption(lastFeature.center, getLabel(lastFeature)));
      }
    }

    return () => {
      destroyRouting();
    };
  }, [urlParts, setMode, setFrom, setTo, setResult, showToast]);
};

const useGetOnSubmitFactory = (
  setResult: (result: RoutingResult) => void,
  setLoading: (value: ((prevState: boolean) => boolean) | boolean) => void,
) => {
  const { showToast } = useSnackbar();

  return (from: Option, to: Option, mode: Profile) => {
    if (!from || !to) {
      return;
    }
    const points = [from, to];
    const url = buildUrl(mode, points);
    if (url === Router.asPath) {
      setLoading(true);
      handleRouting(mode, points.map(getOptionToLonLat))
        .then(setResult)
        .catch(getRoutingFailed(showToast))
        .finally(() => setLoading(false));
    } else {
      Router.push(url);
    }
  };
};

type Props = {
  setResult: (result: RoutingResult) => void;
  hideForm: boolean;
};

const useGlobalMapClickOverride = (
  from: Option,
  setFrom: (value: Option) => void,
  setTo: (value: Option) => void,
) => {
  const { mapClickOverrideRef } = useMapStateContext();

  useEffect(() => {
    mapClickOverrideRef.current = (coords, label) => {
      if (!from) {
        setFrom(getCoordsOption(coords, label));
      } else {
        setTo(getCoordsOption(coords, label));
      }
    };

    return () => {
      mapClickOverrideRef.current = undefined;
    };
  }, [from, mapClickOverrideRef, setFrom, setTo]);
};

export const DirectionsForm = ({ setResult, hideForm }: Props) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Profile>('car');
  const [from, setFrom] = useState<Option>();
  const [to, setTo] = useState<Option>();

  useGlobalMapClickOverride(from, setFrom, setTo);
  useReactToUrl(setMode, setFrom, setTo, setResult);

  const onSubmitFactory = useGetOnSubmitFactory(setResult, setLoading);

  if (hideForm) {
    return null;
  }

  return (
    <StyledPaper elevation={3}>
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <ModeToggler
          value={mode}
          setMode={setMode}
          onChange={(newMode) => onSubmitFactory(from, to, newMode)}
        />
        <div style={{ flex: 1 }} />
        <div>
          <CloseButton />
        </div>
      </Stack>

      <Stack spacing={1} mb={3}>
        <DirectionsAutocomplete
          value={from}
          setValue={setFrom}
          label={t('directions.form.start_or_click')}
          pointIndex={0}
        />
        <DirectionsAutocomplete
          value={to}
          setValue={setTo}
          label={t('directions.form.destination')}
          pointIndex={1}
        />
      </Stack>

      <LoadingButton
        loading={loading}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<SearchIcon />}
        onClick={() => onSubmitFactory(from, to, mode)}
      >
        {t('directions.get_directions')}
      </LoadingButton>
    </StyledPaper>
  );
};
