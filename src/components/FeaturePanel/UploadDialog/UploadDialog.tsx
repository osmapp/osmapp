import React, { ChangeEvent, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { fetchJson, fetchText } from '../../../services/fetch';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getShortId } from '../../../services/helpers';
import {
  editOsmFeature,
  loginAndfetchOsmUser,
} from '../../../services/osmApiAuth';
import { intl } from '../../../services/intl';
import { Feature } from '../../../services/types';
import { clearFeatureCache, quickFetchFeature } from '../../../services/osmApi';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from '../Climbing/utils/photo';
import { useSnackbar } from '../../utils/SnackbarContext';
import { useRouter } from 'next/navigation';

const WIKIPEDIA_LIMIT = 100 * 1024 * 1024;
const BUCKET_URL = 'https://osmapp-upload-tmp.s3.amazonaws.com/';

// Vercel has limit 4.5 MB on payload size, so we have to upload to S3 first
const uploadToS3 = async (file: File) => {
  const key = `${Math.random()}/${file.name}`;

  const body = new FormData();
  body.append('key', key);
  body.append('file', file);

  await fetchText(BUCKET_URL, { method: 'POST', body });

  return `${BUCKET_URL}${key}`;
};

const submitToWikimediaCommons = async (
  url: string,
  filename: string,
  feature: Feature,
) => {
  const shortId = getShortId(feature.osmMeta);

  return await fetchJson('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ url, filename, shortId, lang: intl.lang }),
  });
};

const performUploadWithLogin = async (
  url: string,
  filename: string,
  feature: Feature,
) => {
  try {
    return await submitToWikimediaCommons(url, filename, feature);
  } catch (e) {
    if (e.code === '401') {
      await loginAndfetchOsmUser();
      return await submitToWikimediaCommons(url, filename, feature);
    }
    throw e;
  }
};

const submitToOsm = async (feature: Feature, fileTitle: string) => {
  clearFeatureCache(feature.osmMeta);
  const freshFeature = await quickFetchFeature(feature.osmMeta);
  const newPhotoIndex = getNextWikimediaCommonsIndex(freshFeature.tags);
  await editOsmFeature(
    freshFeature,
    `Upload image ${fileTitle}`,
    {
      ...freshFeature.tags,
      [getWikimediaCommonsKey(newPhotoIndex)]: fileTitle,
    },
    false,
  );

  clearFeatureCache(feature.osmMeta);
};

const useGetHandleFileUpload = (
  feature: Feature,
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setResetKey: React.Dispatch<React.SetStateAction<number>>,
) => {
  const { showToast } = useSnackbar();
  const router = useRouter();

  return async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const filename = file.name;

    if (!file) {
      return;
    }

    if (file.size > WIKIPEDIA_LIMIT) {
      alert('Maximum file size for Wikipedia is 100 MB.'); // eslint-disable-line no-alert
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToS3(file);
      const wikiResponse = await performUploadWithLogin(url, filename, feature);
      const osmResponse = await submitToOsm(feature, wikiResponse.title);

      showToast('Image uploaded successfully', 'success');
      router.refresh();
    } finally {
      setUploading(false);
      setResetKey((key) => key + 1);
    }
  };
};

const UploadButton = () => {
  const { feature } = useFeatureContext();
  const [uploading, setUploading] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  const handleFileUpload = useGetHandleFileUpload(
    feature,
    setUploading,
    setResetKey,
  );

  return (
    <>
      <Button
        component="label"
        variant="contained"
        color="primary"
        // startIcon={<UploadFileIcon />}
        style={{ marginBottom: '1rem' }}
        disabled={uploading}
        key={resetKey}
        endIcon={uploading ? <CircularProgress /> : undefined}
      >
        Upload image
        <input
          type="file"
          // accept="image/*"
          hidden
          onChange={handleFileUpload}
        />
      </Button>
    </>
  );
};

export const UploadDialog = () => {
  const { feature } = useFeatureContext();
  const { osmMeta, skeleton } = feature;
  const editEnabled = !skeleton;

  return (
    <>
      {editEnabled && (
        <>
          <UploadButton />
          <br />
        </>
      )}
    </>
  );
};
