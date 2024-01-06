import React, { useEffect, useState } from 'react';
import { FeatureHeading } from './FeatureHeading';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import { getFullOsmappLink, getUrlOsmId } from '../../services/helpers';
import { EditDialog } from './EditDialog/EditDialog';
import {
  PanelContent,
  PanelFooter,
  PanelScrollbars,
  PanelWrapper,
} from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { FeatureDescription } from './FeatureDescription';
import { ObjectsAround } from './ObjectsAround';
import { OsmError } from './OsmError';
import { Members } from './Members';
import { EditButton } from './EditButton';
import { getLabel } from '../../helpers/featureLabel';
import { ImageSection } from './ImageSection/ImageSection';
import { PublicTransport } from './PublicTransport/PublicTransport';
import { Properties } from './Properties/Properties';
import { fetchOverpassGeojson } from '../../services/overpassSearch';
import { getGlobalMap } from '../../services/mapStorage';

export const FeaturePanel = () => {
  const { feature } = useFeatureContext();

  const [advanced, setAdvanced] = useState(false);
  const [showAround, toggleShowAround] = useToggleState(false);
  const [showTags, toggleShowTags] = useToggleState(false);

  const { point, tags, osmMeta, skeleton, deleted } = feature;
  const editEnabled = !skeleton;
  const showTagsTable = deleted || showTags || (!skeleton && !feature.schema);

  const osmappLink = getFullOsmappLink(feature);
  const label = getLabel(feature);

  useEffect(() => {
    fetchOverpassGeojson(feature).then((geojson) => {
      if (getGlobalMap()) {
        getGlobalMap().getSource('overpass')?.setData(geojson);
      }

      // lets hope :D
      setTimeout(() => {
        getGlobalMap()?.getSource('overpass')?.setData(geojson);
      }, 1000);
    });
  }, [feature]);

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ImageSection />
        <PanelContent>
          <FeatureHeading
            deleted={deleted}
            title={label}
            editEnabled={editEnabled && !point}
          />

          {!skeleton && (
            <>
              <OsmError />

              <Properties
                showTags={showTagsTable}
                key={getUrlOsmId(osmMeta) + (deleted && 'del')}
              />

              {advanced && <Members />}

              <PublicTransport tags={tags} />

              {editEnabled && (
                <>
                  <EditButton isAddPlace={point} isUndelete={deleted} />

                  <EditDialog
                    feature={feature}
                    isAddPlace={point}
                    isUndelete={deleted}
                    key={
                      getUrlOsmId(osmMeta) + (deleted && 'del') // we need to refresh inner state
                    }
                  />
                </>
              )}

              {point && <ObjectsAround advanced={advanced} />}
            </>
          )}

          <PanelFooter>
            <FeatureDescription setAdvanced={setAdvanced} />
            <Coordinates />
            <br />
            <a href={osmappLink}>{osmappLink}</a>
            <br />
            <label>
              <input
                type="checkbox"
                onChange={toggleShowTags}
                checked={showTagsTable}
                disabled={point || deleted || (!skeleton && !feature.schema)}
              />{' '}
              {t('featurepanel.show_tags')}
            </label>{' '}
            <label>
              <input
                type="checkbox"
                onChange={toggleShowAround}
                checked={point || showAround}
                disabled={point}
              />{' '}
              {t('featurepanel.show_objects_around')}
            </label>
            {!point && showAround && <ObjectsAround advanced={advanced} />}
          </PanelFooter>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
